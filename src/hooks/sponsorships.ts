import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { SponsorshipFilters } from '~/components/SponsorshipFilterButton'
import { Minute } from '~/consts'
import {
    Sponsorship as GraphSponsorship,
    OrderDirection,
    Sponsorship_OrderBy,
} from '~/generated/gql/network'
import {
    getAllSponsorships,
    getParsedSponsorshipById,
    getSponsorshipsByCreator,
    getSponsorshipsByStreamId,
} from '~/getters'
import { getSponsorshipStats } from '~/getters/getSponsorshipStats'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import {
    invalidateActiveOperatorByIdQueries,
    useOperatorForWalletQuery,
} from '~/hooks/operators'
import { invalidateSponsorshipFundingHistoryQueries } from '~/hooks/useSponsorshipFundingHistoryQuery'
import { createSponsorshipModal } from '~/modals/CreateSponsorshipModal'
import { editStakeModal } from '~/modals/EditStakeModal'
import { fundSponsorshipModal } from '~/modals/FundSponsorshipModal'
import { joinSponsorshipModal } from '~/modals/JoinSponsorshipModal'
import { Operator } from '~/parsers/Operator'
import { Sponsorship } from '~/parsers/Sponsorship'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { getSigner, useWalletAccount } from '~/shared/stores/wallet'
import { ChartPeriod } from '~/types'
import { getQueryClient } from '~/utils'
import { getBalance } from '~/utils/balance'
import { useCurrentChainId } from '~/utils/chains'
import { getContractAddress } from '~/utils/contracts'
import { FlagBusy } from '~/utils/errors'
import { isRejectionReason } from '~/utils/exceptions'
import { getSponsorshipLeavePenalty } from '~/utils/sponsorships'
import { errorToast } from '~/utils/toast'
import { useTokenInfo } from '~/utils/tokens'
import { useRequestedBlockNumber } from '.'

async function getSponsorshipsAndParse(
    chainId: number,
    getter: () => Promise<GraphSponsorship[]>,
) {
    const sponsorships: Sponsorship[] = []

    const rawSponsorships = await getter()

    for (const raw of rawSponsorships) {
        sponsorships.push(Sponsorship.parse(raw, chainId))
    }

    return sponsorships
}

function invalidateSponsorshipsForCreatorQueries(
    chainId: number,
    address: string | undefined,
) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: [
            'useSponsorshipsForCreatorQuery',
            chainId,
            address?.toLowerCase() || '',
        ],
        refetchType: 'active',
    })
}

export function useSponsorshipsForCreatorQuery(
    address: string | undefined,
    {
        pageSize = 10,
        searchQuery,
        orderBy,
        orderDirection,
        filters,
    }: {
        pageSize?: number
        searchQuery?: string
        orderBy?: string
        orderDirection?: 'asc' | 'desc'
        filters?: SponsorshipFilters
    } = {},
) {
    const currentChainId = useCurrentChainId()

    const creator = address?.toLowerCase() || ''

    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    return useInfiniteQuery({
        queryKey: [
            'useSponsorshipsForCreatorQuery',
            currentChainId,
            creator,
            pageSize,
            searchQuery,
            orderBy,
            orderDirection,
            filters?.expired,
            filters?.inactive,
            filters?.my,
            filters?.noFunding,
            operator?.id,
        ],
        async queryFn({ pageParam: skip }) {
            if (!creator) {
                return {
                    skip,
                    sponsorships: [],
                }
            }

            const sponsorships = await getSponsorshipsAndParse(
                currentChainId,
                () =>
                    getSponsorshipsByCreator(currentChainId, creator, {
                        first: pageSize,
                        skip,
                        searchQuery,
                        orderBy: mapSponsorshipOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                        hasOperatorId: filters?.my ? operator?.id : undefined,
                        includeExpiredFunding: !filters || filters.expired,
                        includeInactive: !filters || filters.inactive,
                        includeWithoutFunding: !filters || filters.noFunding,
                    }) as Promise<GraphSponsorship[]>,
            )

            return {
                skip,
                sponsorships,
            }
        },
        initialPageParam: 0,
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

function invalidateAllSponsorshipsQueries(chainId: number) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllSponsorshipsQuery', chainId],
        refetchType: 'active',
    })
}

export function useAllSponsorshipsQuery({
    pageSize = 10,
    searchQuery,
    orderBy,
    orderDirection,
    filters,
}: {
    pageSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    filters: SponsorshipFilters
}) {
    const currentChainId = useCurrentChainId()

    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    return useInfiniteQuery({
        queryKey: [
            'useAllSponsorshipsQuery',
            currentChainId,
            pageSize,
            searchQuery,
            orderBy,
            orderDirection,
            filters.expired,
            filters.inactive,
            filters.my,
            filters.noFunding,
            operator?.id,
        ],
        async queryFn({ pageParam: skip }) {
            const sponsorships = await getSponsorshipsAndParse(
                currentChainId,
                () =>
                    getAllSponsorships({
                        chainId: currentChainId,
                        first: pageSize,
                        skip,
                        searchQuery,
                        orderBy: mapSponsorshipOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                        hasOperatorId:
                            filters.my && operator != null ? operator.id : undefined,
                        includeExpiredFunding: filters.expired,
                        includeInactive: filters.inactive,
                        includeWithoutFunding: filters.noFunding,
                    }) as Promise<GraphSponsorship[]>,
            )

            return {
                skip,
                sponsorships,
            }
        },
        initialPageParam: 0,
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

function invalidateSponsorshipByIdQueries(chainId: number, sponsorshipId: string) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useSponsorshipByIdQuery', chainId, sponsorshipId.toLowerCase()],
        refetchType: 'active',
    })
}

export function useSponsorshipByIdQuery(sponsorshipId: string) {
    const currentChainId = useCurrentChainId()

    const minBlockNumber = useRequestedBlockNumber()

    return useQuery({
        queryKey: [
            'useSponsorshipByIdQuery',
            currentChainId,
            sponsorshipId.toLowerCase(),
            minBlockNumber,
        ],
        queryFn: () =>
            getParsedSponsorshipById(currentChainId, sponsorshipId, {
                force: true,
                minBlockNumber,
            }),
        retry: false,
    })
}

export function useSponsorshipsByStreamIdQuery({
    pageSize = 10,
    streamId,
    orderBy,
    orderDirection,
    filters,
}: {
    pageSize?: number
    streamId: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    filters?: SponsorshipFilters
}) {
    const currentChainId = useCurrentChainId()

    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    return useInfiniteQuery({
        queryKey: [
            'useSponsorshipsByStreamIdQuery',
            currentChainId,
            streamId,
            pageSize,
            orderBy,
            orderDirection,
            filters?.expired,
            filters?.inactive,
            filters?.my,
            filters?.noFunding,
            operator?.id,
        ],
        async queryFn({ pageParam: skip }) {
            const sponsorships = await getSponsorshipsAndParse(
                currentChainId,
                () =>
                    getSponsorshipsByStreamId({
                        chainId: currentChainId,
                        first: pageSize,
                        skip,
                        streamId,
                        orderBy: mapSponsorshipOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                        hasOperatorId: filters?.my ? operator?.id : undefined,
                        includeExpiredFunding: !filters || filters.expired,
                        includeInactive: !filters || filters.inactive,
                        includeWithoutFunding: !filters || filters.noFunding,
                    }) as Promise<GraphSponsorship[]>,
            )

            return {
                skip,
                sponsorships,
            }
        },
        initialPageParam: 0,
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

function invalidateSponsorshipsByStreamIdQueries(
    chainId: number,
    streamId: string | undefined,
) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useSponsorshipsByStreamIdQuery', chainId, streamId || ''],
        refetchType: 'active',
    })
}

export function useSponsorshipTokenInfo() {
    const chainId = useCurrentChainId()

    return useTokenInfo(getContractAddress('sponsorshipPaymentToken', chainId), chainId)
}

export function useIsCreatingSponsorshipForWallet(wallet: string | undefined) {
    return useIsFlagged(flagKey('isCreatingSponsorship', wallet || ''))
}

export function useCreateSponsorship() {
    const withFlag = useFlagger()

    return useCallback(
        (
            chainId: number,
            wallet: string | undefined,
            options: {
                onDone?: (sponsorshipId: string, blockNumber: number) => void
                streamId?: string
            } = {},
        ) => {
            if (!wallet) {
                return
            }

            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey('isCreatingSponsorship', wallet),
                            async () => {
                                const balance = await getBalance({
                                    chainId,
                                    tokenAddress: getContractAddress(
                                        'sponsorshipPaymentToken',
                                        chainId,
                                    ),
                                    walletAddress: wallet,
                                })

                                const { sponsorshipId, streamId, blockNumber } =
                                    await createSponsorshipModal.pop({
                                        chainId,
                                        balance,
                                        streamId: options.streamId,
                                    })

                                invalidateSponsorshipQueries(
                                    chainId,
                                    wallet,
                                    sponsorshipId,
                                    streamId,
                                )

                                options.onDone?.(sponsorshipId, blockNumber)
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
                } catch (e) {
                    console.warn('Could not create a Sponsorship', e)
                }
            })()
        },
        [withFlag],
    )
}

export function useIsFundingSponsorship(
    sponsorshipId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(
        flagKey('isFundingSponsorship', sponsorshipId || '', wallet || ''),
    )
}

function invalidateSponsorshipDailyBucketsQueries(
    chainId: number,
    sponsorshipId: string,
) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useSponsorshipDailyBucketsQuery', chainId, sponsorshipId],
        refetchType: 'active',
    })
}

export function useSponsorshipDailyBucketsQuery({
    sponsorshipId,
    period,
    dataSource,
}: {
    sponsorshipId: string
    period: ChartPeriod
    dataSource: 'amountStaked' | 'numberOfOperators' | 'apy'
}) {
    const currentChainId = useCurrentChainId()

    return useQuery({
        queryKey: [
            'useSponsorshipDailyBucketsQuery',
            currentChainId,
            sponsorshipId,
            period,
            dataSource,
        ],
        queryFn: async () => {
            try {
                if (!sponsorshipId) {
                    return []
                }

                return await getSponsorshipStats(
                    currentChainId,
                    sponsorshipId,
                    period,
                    dataSource,
                    {
                        force: true,
                        ignoreToday: false,
                    },
                )
            } catch (e) {
                console.warn('Could not load sponsorship chart data', e)

                errorToast({ title: 'Could not load sponsorship chart data' })
            }

            return []
        },
    })
}

/**
 * Returns a function that takes the user through the process of funding
 * a Sponsorship (with the modal and input validation).
 */
export function useFundSponsorshipCallback() {
    const withFlag = useFlagger()

    return useCallback(
        (
            chainId: number,
            sponsorship: Sponsorship,
            options: { onDone?: (wallet: string) => void } = {},
        ) => {
            void (async () => {
                try {
                    const wallet = await (await getSigner()).getAddress()

                    try {
                        await withFlag(
                            flagKey('isFundingSponsorship', sponsorship.id, wallet),
                            async () => {
                                await getSponsorshipTokenInfo(chainId)

                                const balance = await getBalance({
                                    chainId,
                                    tokenAddress: getContractAddress(
                                        'sponsorshipPaymentToken',
                                        chainId,
                                    ),
                                    walletAddress: wallet,
                                })

                                await fundSponsorshipModal.pop({
                                    chainId,
                                    sponsorship,
                                    balance,
                                })

                                invalidateSponsorshipQueries(
                                    chainId,
                                    wallet,
                                    sponsorship.id,
                                )
                            },
                        )

                        options.onDone?.(wallet)
                    } catch (e) {
                        if (e === FlagBusy) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        throw e
                    }
                } catch (e) {
                    console.warn('Failed to fund a sponsorship', sponsorship.id, e)
                }
            })()
        },
        [withFlag],
    )
}

export function useIsJoiningSponsorshipAsOperator(
    sponsorshipId: string | undefined,
    operatorId: string | undefined,
) {
    return useIsFlagged(
        flagKey('isJoiningSponsorshipAsOperator', sponsorshipId || '', operatorId || ''),
    )
}

export function useJoinSponsorshipAsOperator() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            chainId,
            onJoin,
            operator,
            sponsorship,
        }: {
            chainId: number
            onJoin?: () => void
            operator: Operator
            sponsorship: Sponsorship
        }) => {
            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey(
                                'isJoiningSponsorshipAsOperator',
                                sponsorship.id,
                                operator.id,
                            ),
                            async () => {
                                const wallet = await (await getSigner()).getAddress()

                                await joinSponsorshipModal.pop({
                                    chainId,
                                    sponsorship,
                                    preselectedOperator: operator,
                                })

                                invalidateSponsorshipQueries(
                                    chainId,
                                    wallet,
                                    sponsorship.id,
                                )

                                onJoin?.()
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
                } catch (e) {
                    console.warn('Could not join a Sponsorship as an Operator', e)
                }
            })()
        },
        [withFlag],
    )
}

export function useIsEditingSponsorshipFunding(
    sponsorshipId: string | undefined,
    operatorId: string | undefined,
) {
    return useIsFlagged(
        flagKey('isEditingSponsorshipFunding', sponsorshipId || '', operatorId || ''),
    )
}

/**
 * Returns a callback that takes the user through the process
 * of editing their stake.
 */
export function useEditSponsorshipFunding() {
    const withFlag = useFlagger()

    return useCallback(
        (params: {
            chainId: number
            sponsorshipOrSponsorshipId: string | Sponsorship
            operator: Operator
        }) => {
            const { chainId, sponsorshipOrSponsorshipId, operator } = params

            void (async () => {
                try {
                    try {
                        const sponsorship = await (async () => {
                            if (typeof sponsorshipOrSponsorshipId !== 'string') {
                                return sponsorshipOrSponsorshipId
                            }

                            const result = await getParsedSponsorshipById(
                                chainId,
                                sponsorshipOrSponsorshipId,
                                { force: true },
                            )

                            if (!result) {
                                throw new Error('Sponsorship not found')
                            }

                            return result
                        })()

                        await withFlag(
                            flagKey(
                                'isEditingSponsorshipFunding',
                                sponsorship.id,
                                operator.id,
                            ),
                            async () => {
                                const wallet = await (await getSigner()).getAddress()

                                /**
                                 * If the sponsorship token info has already been fetched
                                 * the following call will do nothing. Otherwise, it'll fetch
                                 * and cache it. Speed things up later on.
                                 */
                                await getSponsorshipTokenInfo(chainId)

                                const leavePenalty = await getSponsorshipLeavePenalty(
                                    chainId,
                                    sponsorship.id,
                                    operator.id,
                                )

                                await editStakeModal.pop({
                                    chainId,
                                    operator,
                                    sponsorship,
                                    leavePenalty,
                                })

                                invalidateSponsorshipQueries(
                                    chainId,
                                    wallet,
                                    sponsorship.id,
                                )
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
                } catch (e) {
                    console.warn('Could not edit stake', e)
                }
            })()
        },
        [withFlag],
    )
}

const mapSponsorshipOrder = (columnKey?: string): Sponsorship_OrderBy => {
    switch (columnKey) {
        case 'operators':
            return Sponsorship_OrderBy.OperatorCount
        case 'staked':
            return Sponsorship_OrderBy.TotalStakedWei
        case 'apy':
            return Sponsorship_OrderBy.SpotApy
        case 'fundedUntil':
            return Sponsorship_OrderBy.ProjectedInsolvency
        case 'payoutPerDay':
            return Sponsorship_OrderBy.TotalPayoutWeiPerSec
        case 'remainingWei':
            return Sponsorship_OrderBy.RemainingWei
        case 'streamInfo':
        default:
            return Sponsorship_OrderBy.Id
    }
}

/**
 * Invalidates a collection of sponsorship-related queries.
 */
export function invalidateSponsorshipQueries(
    chainId: number,
    invalidator: string | undefined,
    sponsorshipId: string | undefined,
    streamId: string | undefined = undefined,
) {
    if (!invalidator || !sponsorshipId) {
        return
    }

    invalidateSponsorshipsForCreatorQueries(chainId, invalidator)

    invalidateAllSponsorshipsQueries(chainId)

    invalidateSponsorshipByIdQueries(chainId, sponsorshipId)

    invalidateSponsorshipDailyBucketsQueries(chainId, sponsorshipId)

    invalidateSponsorshipFundingHistoryQueries(chainId, sponsorshipId)

    invalidateSponsorshipsByStreamIdQueries(chainId, streamId)

    /**
     * Invalidate OperatorById queries used mainly by Operator pages,
     * too. There's the Sponsorships section there and it's driven
     * by operator's collection of stakes.
     */
    invalidateActiveOperatorByIdQueries(chainId, undefined)
}
