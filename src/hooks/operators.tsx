import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
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
    searchOperatorsByMetadata,
} from '~/getters'
import { getQueryClient, isTransactionRejection, waitForIndexedBlock } from '~/utils'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { Delegation, DelegationsStats } from '~/types'
import { BN, toBN } from '~/utils/bn'
import { errorToast, successToast } from '~/utils/toast'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { Layer } from '~/utils/Layer'
import { getBalance } from '~/getters/getBalance'
import { getOperatorDelegationAmount } from '~/services/operators'
import { Break, FlagBusy } from '~/utils/errors'
import { isRejectionReason } from '~/modals/BaseModal'
import getCoreConfig from '~/getters/getCoreConfig'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'
import { confirm } from '~/getters/confirm'
import { collectEarnings } from '~/services/sponsorships'
import { truncate } from '~/shared/utils/text'
import { useUncollectedEarningsStore } from '~/shared/stores/uncollectedEarnings'
import { forceUndelegateModal } from '~/modals/ForceUndelegateModal'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { invalidateSponsorshipQueries } from '~/hooks/sponsorships'
import { getSigner } from '~/shared/stores/wallet'
import { useCurrentChainId } from '~/shared/stores/chain'
import { getCurrentChainId } from '~/getters/getCurrentChain'

export function useOperatorForWalletQuery(address = '') {
    const currentChainId = useCurrentChainId()
    return useQuery({
        queryKey: ['useOperatorForWalletQuery', currentChainId, address.toLowerCase()],
        queryFn: () => getParsedOperatorByOwnerAddress(address, { force: true }),
    })
}

export function useOperatorByIdQuery(operatorId = '') {
    const currentChainId = useCurrentChainId()
    return useQuery({
        queryKey: ['operatorByIdQueryKey', currentChainId, operatorId],
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
    const currentChainId = getCurrentChainId()

    if (operatorId) {
        return getQueryClient().invalidateQueries({
            queryKey: ['operatorByIdQueryKey', currentChainId, operatorId],
            exact: true,
            refetchType: 'active',
        })
    }

    return getQueryClient().invalidateQueries({
        queryKey: ['operatorByIdQueryKey', currentChainId],
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
    const currentChainId = getCurrentChainId()
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useDelegationsForWalletQuery', currentChainId],
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
    const currentChainId = useCurrentChainId()

    const address = addressProp.toLowerCase()

    const searchQuery = searchQueryProp.toLowerCase()

    return useInfiniteQuery({
        queryKey: [
            'useDelegationsForWalletQuery',
            currentChainId,
            address,
            searchQuery,
            pageSize,
        ],
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
    const currentChainId = getCurrentChainId()
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllOperatorsQuery', currentChainId],
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
    const currentChainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: [
            'useAllOperatorsQuery',
            currentChainId,
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
    const chainId = useCurrentChainId()

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
    const chainId = useCurrentChainId()

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
/**
 * Returns a callback that takes the user through the process of collecting
 * earnings for given operator/sponsorship pair.
 */
export function useCollectEarnings() {
    const { fetch: fetchUncollectedEarnings } = useUncollectedEarningsStore()

    return useCallback(
        (params: { sponsorshipId: string; operatorId: string }) => {
            const { sponsorshipId, operatorId } = params

            void (async () => {
                try {
                    if (
                        !(await confirm({
                            cancelLabel: 'Cancel',
                            proceedLabel: 'Proceed',
                            title: 'Confirm',
                            description: (
                                <>
                                    This action transfers uncollected earnings to the
                                    Operator contract ({truncate(operatorId)}).
                                </>
                            ),
                        }))
                    ) {
                        return
                    }

                    await collectEarnings(sponsorshipId, operatorId, {
                        onBlockNumber: waitForIndexedBlock,
                    })

                    await fetchUncollectedEarnings(operatorId)

                    /**
                     * Let's refresh the operator page to incl. now-collected earnings
                     * in the overview section.
                     */
                    invalidateActiveOperatorByIdQueries(operatorId)

                    successToast({
                        title: 'Earnings collected!',
                        autoCloseAfter: 5,
                        desc: (
                            <p>
                                Earnings have been successfully collected and are now
                                available in the Operator&nbsp;balance.
                            </p>
                        ),
                    })
                } catch (e) {
                    if (e === Break) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    console.error('Could not collect earnings', e)
                }
            })()
        },
        [fetchUncollectedEarnings],
    )
}

/**
 * Returns a callback that takes the user through force-undelegation process.
 */
export function useForceUndelegate() {
    return useCallback((operator: ParsedOperator, amount: BN) => {
        void (async () => {
            try {
                const wallet = await (await getSigner()).getAddress()

                await getSponsorshipTokenInfo()

                const sponsorshipId = await forceUndelegateModal.pop({
                    operator,
                    amount,
                })

                invalidateSponsorshipQueries(wallet, sponsorshipId)
            } catch (e) {
                if (e === Break) {
                    return
                }

                if (isRejectionReason(e)) {
                    return
                }

                console.error('Could not force undelegate', e)
            }
        })()
    }, [])
}
