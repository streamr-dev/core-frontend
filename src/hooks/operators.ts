import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { Operator, Operator_OrderBy, OrderDirection } from '~/generated/gql/network'
import {
    getAllOperators,
    getDelegatedAmountForWallet,
    getOperatorById,
    getOperatorByOwnerAddress,
    getOperatorsByDelegation,
    getOperatorsByDelegationAndId,
    getOperatorsByDelegationAndMetadata,
    getParsedOperators,
    getSpotApy,
    searchOperatorsById,
    searchOperatorsByMetadata,
} from '~/getters'
import { isEthereumAddress } from '~/marketplace/utils/validate'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { Delegation, DelegationsStats } from '~/types'
import { toBN } from '~/utils/bn'
import { delegateFunds, undelegateFunds } from '~/utils/operators'
import { errorToast } from '~/utils/toast'
import { useConfigValueFromChain } from '~/hooks'

export function useOperatorForWalletQuery(address = '') {
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

export function useOperatorByIdQuery(operatorId = '') {
    return useQuery({
        queryKey: ['useOperatorByIdQuery', operatorId],
        async queryFn() {
            if (!operatorId) {
                return null
            }

            const operator = await getOperatorById(operatorId)

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

function toDelegationForWallet(operator: ParsedOperator, wallet: string): Delegation {
    return {
        ...operator,
        apy: getSpotApy(operator),
        myShare: getDelegatedAmountForWallet(wallet, operator),
    }
}

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
        queryKey: ['useDelegationsQuery', address, searchQuery, pageSize],
        async queryFn({ pageParam: skip = 0 }) {
            const elements: Delegation[] = await getParsedOperators(
                () => {
                    const params = {
                        first: pageSize,
                        skip,
                        address,
                        orderBy: mapOperatorOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                    }

                    if (!searchQuery) {
                        /**
                         * Empty search = look for all operators.
                         */
                        return getOperatorsByDelegation(params) as Promise<Operator[]>
                    }

                    if (isEthereumAddress(searchQuery)) {
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
                    }

                    if (!searchQuery) {
                        return getAllOperators(params) as Promise<Operator[]>
                    }

                    if (isEthereumAddress(searchQuery)) {
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

/**
 * Triggers funds delegation and raises an associated flag for the
 * duration of the process.
 */
export function useDelegateFunds() {
    const withFlag = useFlagger()

    return useCallback(
        ({ operator, wallet }: { operator: ParsedOperator; wallet: string }) =>
            withFlag(flagKey('isDelegatingFunds', operator.id, wallet), () =>
                delegateFunds({
                    operator,
                    wallet,
                }),
            ),
        [withFlag],
    )
}

export function useIsUndelegatingFundsToOperator(
    operatorId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(flagKey('isUndelegatingFunds', operatorId || '', wallet || ''))
}

/**
 * Triggers funds undelegation and raises an associated flag for the
 * duration of the process.
 */
export function useUndelegateFunds() {
    const withFlag = useFlagger()

    const minimumSelfDelegationFraction = useConfigValueFromChain(
        'minimumSelfDelegationFraction',
    )

    return useCallback(
        ({ operator, wallet }: { operator: ParsedOperator; wallet: string }) =>
            withFlag(flagKey('isUndelegatingFunds', operator.id, wallet), () =>
                undelegateFunds({
                    minimumSelfDelegationFraction,
                    operator,
                    wallet,
                }),
            ),
        [minimumSelfDelegationFraction, withFlag],
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
