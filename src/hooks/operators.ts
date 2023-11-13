import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { toaster } from 'toasterhea'
import { isAddress } from 'web3-validator'
import { Operator, Operator_OrderBy, OrderDirection } from '~/generated/gql/network'
import {
    getAllOperators,
    getDelegatedAmountForWallet,
    getOperatorById,
    getOperatorsByDelegation,
    getOperatorsByDelegationAndId,
    getOperatorsByDelegationAndMetadata,
    getParsedOperatorByOwnerAddress,
    getParsedOperators,
    getSpotApy,
    searchOperatorsById,
    searchOperatorsByMetadata,
} from '~/getters'
import { getQueryClient } from '~/utils'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { Delegation, DelegationsStats } from '~/types'
import { toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { Layer } from '~/utils/Layer'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { getBalance } from '~/getters/getBalance'
import { getOperatorDelegationAmount } from '~/services/operators'
import { FlagBusy } from '~/utils/errors'
import { isRejectionReason } from '~/modals/BaseModal'
import getCoreConfig from '~/getters/getCoreConfig'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'

export function useOperatorForWalletQuery(address = '') {
    return useQuery({
        queryKey: ['useOperatorForWalletQuery', address.toLowerCase()],
        queryFn: () => getParsedOperatorByOwnerAddress(address, { force: true }),
    })
}

export function useOperatorByIdQuery(operatorId = '') {
    return useQuery({
        queryKey: ['operatorByIdQueryKey', operatorId],
        async queryFn() {
            if (!operatorId) {
                return null
            }

            const operator = await getOperatorById(operatorId, { force: true })

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
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export function invalidateActiveOperatorByIdQueries(operatorId: string | undefined) {
    if (operatorId) {
        return getQueryClient().invalidateQueries({
            queryKey: ['operatorByIdQueryKey', operatorId],
            exact: true,
            refetchType: 'active',
        })
    }

    return getQueryClient().invalidateQueries({
        queryKey: ['operatorByIdQueryKey'],
        exact: false,
        refetchType: 'active',
    })
}

export function useOperatorStatsForWallet(address = '') {
    const { data: operator = null } = useOperatorForWalletQuery(address)

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

function toDelegationForWallet(operator: ParsedOperator, wallet: string): Delegation {
    return {
        ...operator,
        apy: getSpotApy(operator),
        myShare: getDelegatedAmountForWallet(wallet, operator),
    }
}
/**
 * @todo Refactor using `useQuery`.
 */
export function useDelegationsStats(address = '') {
    const [stats, setStats] = useState<DelegationsStats | undefined | null>()

    const addr = address.toLowerCase()

    useEffect(() => {
        let mounted = true

        if (!addr) {
            setStats(null)

            return () => {}
        }

        setStats(undefined)

        setTimeout(async () => {
            const operators = await getParsedOperators(
                () =>
                    getOperatorsByDelegation({
                        first: 1000,
                        address: addr,
                    }) as Promise<Operator[]>,
                {
                    mapper(operator) {
                        return toDelegationForWallet(operator, addr)
                    },
                    onBeforeComplete(total, parsed) {
                        if (total !== parsed) {
                            errorToast({
                                title: 'Warning',
                                desc: `Delegation stats are calculated using ${parsed} out of ${total} available operators due to parsing issues.`,
                            })
                        }
                    },
                },
            )

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

export function invalidateDelegationsForWalletQueries() {
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useDelegationsForWalletQuery'],
        refetchType: 'active',
    })
}

export function useDelegationsForWalletQuery({
    address: addressProp = '',
    pageSize = 10,
    searchQuery: searchQueryProp = '',
    orderBy,
    orderDirection,
}: {
    address?: string
    pageSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const address = addressProp.toLowerCase()

    const searchQuery = searchQueryProp.toLowerCase()

    return useInfiniteQuery({
        queryKey: ['useDelegationsForWalletQuery', address, searchQuery, pageSize],
        async queryFn({ pageParam: skip = 0 }) {
            const elements: Delegation[] = await getParsedOperators(
                () => {
                    const params = {
                        first: pageSize,
                        skip,
                        address,
                        orderBy: mapOperatorOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }

                    if (!searchQuery) {
                        /**
                         * Empty search = look for all operators.
                         */
                        return getOperatorsByDelegation(params) as Promise<Operator[]>
                    }

                    if (isAddress(searchQuery)) {
                        /**
                         * Look for a delegation for a given operator id.
                         */
                        return getOperatorsByDelegationAndId({
                            ...params,
                            operatorId: searchQuery,
                        }) as Promise<Operator[]>
                    }

                    return getOperatorsByDelegationAndMetadata({
                        ...params,
                        searchQuery,
                    }) as Promise<Operator[]>
                },
                {
                    mapper(operator) {
                        return toDelegationForWallet(operator, address)
                    },
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
                },
            )

            return {
                skip,
                elements,
            }
        },
        getNextPageParam: ({ skip, elements }) => {
            return elements.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export function invalidateAllOperatorsQueries() {
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllOperatorsQuery'],
        refetchType: 'active',
    })
}

export function useAllOperatorsQuery({
    batchSize = 10,
    searchQuery: searchQueryProp = '',
    orderBy,
    orderDirection,
}: {
    batchSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const searchQuery = searchQueryProp.toLowerCase()

    return useInfiniteQuery({
        queryKey: [
            'useAllOperatorsQuery',
            searchQuery,
            batchSize,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
            const elements = await getParsedOperators(
                () => {
                    const params = {
                        first: batchSize,
                        skip,
                        orderBy: mapOperatorOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }

                    if (!searchQuery) {
                        return getAllOperators(params) as Promise<Operator[]>
                    }

                    if (isAddress(searchQuery)) {
                        return searchOperatorsById({
                            ...params,
                            operatorId: searchQuery,
                        }) as Promise<Operator[]>
                    }

                    return searchOperatorsByMetadata({
                        ...params,
                        searchQuery,
                    }) as Promise<Operator[]>
                },
                {
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
                },
            )

            return {
                skip,
                elements,
            }
        },
        getNextPageParam: ({ skip, elements }) => {
            return elements.length === batchSize ? skip + batchSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export function useIsDelegatingFundsToOperator(
    operatorId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(flagKey('isDelegatingFunds', operatorId || '', wallet || ''))
}

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

/**
 * Triggers funds delegation and raises an associated flag for the
 * duration of the process.
 */
export function useDelegateFunds() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            onDone,
            operator,
            wallet,
        }: {
            onDone?: () => void
            operator: ParsedOperator
            wallet: string | undefined
        }) => {
            if (!wallet) {
                return
            }

            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey('isDelegatingFunds', operator.id, wallet),
                            async () => {
                                const paymentTokenSymbol =
                                    getCoreConfig().sponsorshipPaymentToken

                                const { id: chainId } = defaultChainConfig

                                const balance = await getBalance(
                                    wallet,
                                    paymentTokenSymbol,
                                    {
                                        chainId,
                                    },
                                )

                                const delegatedTotal = await getOperatorDelegationAmount(
                                    operator.id,
                                    wallet,
                                )

                                await delegateFundsModal.pop({
                                    operator,
                                    balance,
                                    delegatedTotal,
                                })

                                invalidateActiveOperatorByIdQueries(operator.id)
                            },
                        )
                    } catch (e) {
                        if (e === FlagBusy) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        throw e
                    }

                    onDone?.()
                } catch (e) {
                    console.warn('Could not delegate funds', e)
                }
            })()
        },
        [withFlag],
    )
}

export function useIsUndelegatingFundsToOperator(
    operatorId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(flagKey('isUndelegatingFunds', operatorId || '', wallet || ''))
}

const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)

/**
 * Triggers funds undelegation and raises an associated flag for the
 * duration of the process.
 */
export function useUndelegateFunds() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            onDone,
            operator,
            wallet,
        }: {
            onDone?: () => void
            operator: ParsedOperator
            wallet: string | undefined
        }) => {
            if (!wallet) {
                return
            }

            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey('isUndelegatingFunds', operator.id, wallet),
                            async () => {
                                const paymentTokenSymbol =
                                    getCoreConfig().sponsorshipPaymentToken

                                const { id: chainId } = defaultChainConfig

                                const balance = await getBalance(
                                    wallet,
                                    paymentTokenSymbol,
                                    {
                                        chainId,
                                    },
                                )

                                const delegatedTotal = await getOperatorDelegationAmount(
                                    operator.id,
                                    wallet,
                                )

                                await undelegateFundsModal.pop({
                                    operator,
                                    balance,
                                    delegatedTotal,
                                })

                                invalidateActiveOperatorByIdQueries(operator.id)
                            },
                        )
                    } catch (e) {
                        if (e === FlagBusy) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        throw e
                    }

                    onDone?.()
                } catch (e) {
                    console.warn('Could not undelegate funds', e)
                }
            })()
        },
        [withFlag],
    )
}

const mapOperatorOrder = (orderBy: string | undefined): Operator_OrderBy => {
    switch (orderBy) {
        case 'totalValue':
            return Operator_OrderBy.ValueWithoutEarnings
        case 'deployed':
            return Operator_OrderBy.TotalStakeInSponsorshipsWei
        case 'operatorCut':
            return Operator_OrderBy.OperatorsCutFraction
        default:
            return Operator_OrderBy.Id
    }
}
