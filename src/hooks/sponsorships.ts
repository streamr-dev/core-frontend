import { useCallback } from 'react'
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import { config } from '@streamr/config'
import { toaster } from 'toasterhea'
import { OrderDirection, Sponsorship, Sponsorship_OrderBy } from '~/generated/gql/network'
import {
    getAllSponsorships,
    getParsedSponsorshipById,
    getSponsorshipsByCreator,
} from '~/getters'
import { ParsedSponsorship, SponsorshipParser } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'
import useTokenInfo from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'
import { Chain, ChartPeriod } from '~/types'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { getSponsorshipLeavePenalty } from '~/utils/sponsorships'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { isRejectionReason } from '~/modals/BaseModal'
import { FlagBusy } from '~/utils/errors'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import { Layer } from '~/utils/Layer'
import { createSponsorshipModal } from '~/modals/CreateSponsorshipModal'
import { getBalanceForSponsorship } from '~/utils/sponsorships'
import { getQueryClient } from '~/utils'
import { getSigner } from '~/shared/stores/wallet'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fundSponsorshipModal } from '~/modals/FundSponsorshipModal'
import { getSponsorshipStats } from '~/getters/getSponsorshipStats'
import { invalidateSponsorshipFundingHistoryQueries } from '~/hooks/useSponsorshipFundingHistoryQuery'
import { invalidateActiveOperatorByIdQueries } from '~/hooks/operators'
import { editStakeModal } from '~/modals/EditStakeModal'

function getDefaultQueryParams(pageSize: number) {
    return {
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    }
}

async function getSponsorshipsAndParse(getter: () => Promise<Sponsorship[]>) {
    const sponsorships: ParsedSponsorship[] = []

    let preparsedCount = 0

    try {
        const rawSponsorships = await getter()

        preparsedCount = rawSponsorships.length

        for (let i = 0; i < rawSponsorships.length; i++) {
            try {
                sponsorships.push(await SponsorshipParser.parseAsync(rawSponsorships[i]))
            } catch (e) {
                console.warn('Failed to parse a sponsorship', e)
            }
        }
    } catch (e) {
        console.warn('Could not fetch the sponsorships', e)

        errorToast({ title: 'Could not fetch sponsorships' })
    }

    if (preparsedCount !== sponsorships.length) {
        errorToast({
            title: 'Failed to parse',
            desc: `${
                preparsedCount - sponsorships.length
            } out of ${preparsedCount} sponsorships could not be parsed.`,
        })
    }

    return sponsorships
}

function invalidateSponsorshipsForCreatorQueries(address: string | undefined) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useSponsorshipsForCreatorQuery', address?.toLowerCase() || ''],
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
    }: {
        pageSize?: number
        searchQuery?: string
        orderBy?: string
        orderDirection?: 'asc' | 'desc'
    } = {},
): UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }> {
    const creator = address?.toLowerCase() || ''

    return useInfiniteQuery({
        queryKey: [
            'useSponsorshipsForCreatorQuery',
            creator,
            pageSize,
            searchQuery,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
            if (!creator) {
                return {
                    skip,
                    sponsorships: [],
                }
            }

            const sponsorships = await getSponsorshipsAndParse(
                () =>
                    getSponsorshipsByCreator(creator, {
                        first: pageSize,
                        skip,
                        searchQuery,
                        orderBy: mapSponsorshipOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }) as Promise<Sponsorship[]>,
            )

            return {
                skip,
                sponsorships,
            }
        },
        ...getDefaultQueryParams(pageSize),
    })
}

function invalidateAllSponsorshipsQueries() {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllSponsorshipsQuery'],
        refetchType: 'active',
    })
}

export function useAllSponsorshipsQuery({
    pageSize = 10,
    searchQuery,
    orderBy,
    orderDirection,
}: {
    pageSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    return useInfiniteQuery({
        queryKey: [
            'useAllSponsorshipsQuery',
            pageSize,
            searchQuery,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
            const sponsorships = await getSponsorshipsAndParse(
                () =>
                    getAllSponsorships({
                        first: pageSize,
                        skip,
                        searchQuery,
                        orderBy: mapSponsorshipOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }) as Promise<Sponsorship[]>,
            )

            return {
                skip,
                sponsorships,
            }
        },
        ...getDefaultQueryParams(pageSize),
    })
}

function invalidateSponsorshipByIdQueries(sponsorshipId: string) {
    return getQueryClient().invalidateQueries({
        exact: true,
        queryKey: ['useSponsorshipByIdQuery', sponsorshipId.toLowerCase()],
        refetchType: 'active',
    })
}

export function useSponsorshipByIdQuery(sponsorshipId: string) {
    return useQuery({
        queryKey: ['useSponsorshipByIdQuery', sponsorshipId.toLowerCase()],
        queryFn: () => getParsedSponsorshipById(sponsorshipId, { force: true }),
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export function useSponsorshipTokenInfo() {
    const { contracts, id: chainId } = config[
        getCoreConfig().defaultChain || 'polygon'
    ] as Chain

    return useTokenInfo(contracts[getCoreConfig().sponsorshipPaymentToken], chainId)
}

export function useIsCreatingSponsorshipForWallet(wallet: string | undefined) {
    return useIsFlagged(flagKey('isCreatingSponsorship', wallet || ''))
}

export function useCreateSponsorship() {
    const withFlag = useFlagger()

    return useCallback(
        (
            wallet: string | undefined,
            options: { onDone?: (sponsorshipId: string) => void } = {},
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
                                const balance = await getBalanceForSponsorship(wallet)

                                const sponsorshipId = await createSponsorshipModal.pop({
                                    balance,
                                })

                                invalidateSponsorshipQueries(wallet, sponsorshipId)

                                options.onDone?.(sponsorshipId)
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

function invalidateSponsorshipDailyBucketsQueries(sponsorshipId: string) {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useSponsorshipDailyBucketsQuery', sponsorshipId],
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
    return useQuery({
        queryKey: ['useSponsorshipDailyBucketsQuery', sponsorshipId, period, dataSource],
        queryFn: async () => {
            try {
                if (!sponsorshipId) {
                    return []
                }

                return await getSponsorshipStats(sponsorshipId, period, dataSource, {
                    force: true,
                    ignoreToday: false,
                })
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
            sponsorship: ParsedSponsorship,
            options: { onDone?: (wallet: string) => void } = {},
        ) => {
            void (async () => {
                try {
                    const wallet = await (await getSigner()).getAddress()

                    try {
                        await withFlag(
                            flagKey('isFundingSponsorship', sponsorship.id, wallet),
                            async () => {
                                await getSponsorshipTokenInfo()

                                await fundSponsorshipModal.pop({
                                    sponsorship,
                                    balance: await getBalanceForSponsorship(wallet),
                                })

                                invalidateSponsorshipQueries(wallet, sponsorship.id)
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

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)

export function useJoinSponsorshipAsOperator() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            onJoin,
            operator,
            sponsorship,
        }: {
            onJoin?: () => void
            operator: ParsedOperator
            sponsorship: ParsedSponsorship
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

                                await joinSponsorshipModal.pop({ sponsorship, operator })

                                invalidateSponsorshipQueries(wallet, sponsorship.id)

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
        ({
            sponsorship,
            operator,
        }: {
            sponsorship: ParsedSponsorship
            operator: ParsedOperator
        }) => {
            void (async () => {
                try {
                    try {
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
                                await getSponsorshipTokenInfo()

                                const leavePenaltyWei = await getSponsorshipLeavePenalty(
                                    sponsorship.id,
                                    operator.id,
                                )

                                await editStakeModal.pop({
                                    operator,
                                    sponsorship,
                                    leavePenaltyWei,
                                })

                                invalidateSponsorshipQueries(wallet, sponsorship.id)
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
        case 'streamInfo':
        default:
            return Sponsorship_OrderBy.Id
    }
}

/**
 * Invalidates a collection of sponsorship-related queries.
 */
function invalidateSponsorshipQueries(
    invalidator: string | undefined,
    sponsorshipId: string | undefined,
) {
    if (!invalidator || !sponsorshipId) {
        return
    }

    invalidateSponsorshipsForCreatorQueries(invalidator)

    invalidateAllSponsorshipsQueries()

    invalidateSponsorshipByIdQueries(sponsorshipId)

    invalidateSponsorshipDailyBucketsQueries(sponsorshipId)

    invalidateSponsorshipFundingHistoryQueries(sponsorshipId)

    /**
     * Invalidate OperatorById queries (all active) used mainly by Operator
     * pages, too. There's the Sponsorships section there and it's driven
     * by operator's collection of stakes.
     */
    invalidateActiveOperatorByIdQueries(undefined)
}
