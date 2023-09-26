import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { getDelegacyForWallet, getOperatorByOwnerAddress } from '~/getters'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { DelegacyStats, Delegation } from '~/types'
import { toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'

interface WalletOperatorEntry {
    fetchedAt: number
    fetching: boolean
    value: ParsedOperator | null | undefined
}

interface WalletOperatorsStore {
    operators: Record<string, WalletOperatorEntry | undefined>
}

interface WalletOperatorsActions {
    fetch: (
        address: string,
        options?: {
            onDone?: () => void
            onError?: (e: unknown) => void
        },
    ) => void

    fetchAsync: (address: string) => Promise<void>
}

const useWalletOperatorsStore = create<WalletOperatorsStore & WalletOperatorsActions>(
    (set, get) => {
        function setEntry(address = '', fn: (entryDraft: WalletOperatorEntry) => void) {
            set((store) =>
                produce(store, (draft) => {
                    const current = draft.operators[address] || {
                        fetchedAt: -1,
                        fetching: false,
                        value: undefined,
                    }

                    draft.operators[address] = current

                    fn(current as WalletOperatorEntry)
                }),
            )
        }

        function expired(address = '') {
            return (get().operators[address]?.fetchedAt || 0) < Date.now() - 60 * 1000
        }

        function isFetching(address = '') {
            return get().operators[address]?.fetching === true
        }

        async function fetchAsync(address = '') {
            const addr = address.toLowerCase()

            if (!addr || isFetching(addr) || !expired(addr)) {
                return
            }

            try {
                setEntry(addr, (draft) => {
                    draft.fetching = true
                })

                const operator = await getOperatorByOwnerAddress(addr)

                setEntry(addr, (draft) => {
                    draft.fetchedAt = Date.now()

                    draft.value = operator ? OperatorParser.parse(operator) : null
                })
            } finally {
                setEntry(addr, (draft) => {
                    draft.fetching = false
                })
            }
        }

        return {
            operators: {},

            fetchAsync,

            fetch(address = '', { onDone, onError } = {}) {
                setTimeout(async () => {
                    try {
                        await fetchAsync(address)

                        onDone?.()
                    } catch (e) {
                        onError?.(e)
                    }
                })
            },
        }
    },
)

export function useOperatorForWallet(address = '') {
    const addr = address.toLowerCase()

    const {
        operators: { [addr]: { value: operator = null } = {} },
        fetch,
    } = useWalletOperatorsStore()

    useEffect(() => void fetch(addr), [addr, fetch])

    return operator
}

export function useIsLoadingOperatorForWallet(address = ''): boolean {
    return useWalletOperatorsStore().operators[address.toLowerCase()]?.fetching === true
}

export function useOperatorStatsForWallet(address = '') {
    const operator = useOperatorForWallet(address)

    if (!operator) {
        return operator
    }

    const { delegatorCount: numOfDelegators, poolValue: value, stakes } = operator

    return {
        numOfDelegators,
        numOfSponsorships: stakes.length,
        value,
    }
}

export function useDelegacyStats(address = '') {
    const [stats, setStats] = useState<DelegacyStats | undefined | null>()

    const addr = address.toLowerCase()

    useEffect(() => {
        let mounted = true

        if (!addr) {
            setStats(null)

            return () => {}
        }

        setStats(undefined)

        setTimeout(async () => {
            const operators = await getDelegacyForWallet(addr, {
                batchSize: 1000,
                onBeforeComplete(total, parsed) {
                    if (total !== parsed) {
                        errorToast({
                            title: 'Warning',
                            desc: `Delegation stats are calculated using ${parsed} out of ${total} available operators due to parsing issues.`,
                        })
                    }
                },
            })

            if (!mounted) {
                return
            }

            if (!operators.length) {
                return void setStats({
                    value: toBN(0),
                    minApy: 0,
                    maxApy: 0,
                    numOfOperators: 0,
                })
            }

            let minApy = Number.POSITIVE_INFINITY

            let maxApy = Number.NEGATIVE_INFINITY

            operators.forEach(({ apy }) => {
                minApy = Math.min(minApy, apy)

                maxApy = Math.max(maxApy, apy)
            })

            const value = operators.reduce(
                (sum, { myShare }) => sum.plus(myShare),
                toBN(0),
            )

            setStats({
                value,
                minApy,
                maxApy,
                numOfOperators: operators.length,
            })
        })

        return () => {
            mounted = false
        }
    }, [addr])

    return stats
}

export function useDelegacyForWalletQuery(
    address = '',
    { pageSize = 10 }: { pageSize?: number } = {},
): UseInfiniteQueryResult<{ skip: number; delegations: Delegation[] }> {
    return useInfiniteQuery({
        queryKey: ['useDelegationsForWalletQuery', address.toLowerCase(), pageSize],
        async queryFn({ pageParam: skip = 0 }) {
            let delegations: Delegation[] = []

            try {
                delegations = await getDelegacyForWallet(address, {
                    batchSize: pageSize,
                    skip,
                    onBeforeComplete(total, parsed) {
                        if (total !== parsed) {
                            errorToast({
                                title: 'Failed to parse',
                                desc: `${
                                    total - parsed
                                } out of ${total} operators could not be parsed.`,
                            })
                        }
                    },
                })
            } catch (e) {
                console.warn('Could not fetch operators', e)

                errorToast({ title: 'Could not fetch operators' })
            }

            return {
                skip,
                delegations,
            }
        },
        getNextPageParam: ({ skip, delegations }) => {
            return delegations.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
