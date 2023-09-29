import { UseInfiniteQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { getDelegacyForWallet, getOperatorByOwnerAddress } from '~/getters'
import { OperatorParser } from '~/parsers/OperatorParser'
import { DelegacyStats, Delegation } from '~/types'
import { toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'

function useOperatorForWalletQuery(address = '') {
    const addr = address.toLowerCase()

    return useQuery({
        queryKey: ['useOperatorForWalletQuery', addr],
        async queryFn() {
            const operator = await getOperatorByOwnerAddress(addr)

            if (operator) {
                try {
                    return OperatorParser.parse(operator)
                } catch (e) {
                    if (!(e instanceof z.ZodError)) {
                        throw e
                    }

                    console.warn('Failed to parse an operator', operator, e)
                }
            }

            return null
        },
    })
}

export function useOperatorForWallet(address = '') {
    return useOperatorForWalletQuery(address).data || null
}

export function useIsLoadingOperatorForWallet(address = ''): boolean {
    const query = useOperatorForWalletQuery(address)

    return query.isLoading || query.isFetching
}

export function useOperatorStatsForWallet(address = '') {
    const operator = useOperatorForWallet(address)

    if (!operator) {
        return operator
    }

    const {
        delegatorCount: numOfDelegators,
        valueWithoutEarnings: value,
        stakes,
    } = operator

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
