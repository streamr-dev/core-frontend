import { useCallback } from 'react'
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import { config } from '@streamr/config'
import { toaster } from 'toasterhea'
import { OrderDirection, Sponsorship, Sponsorship_OrderBy } from '~/generated/gql/network'
import {
    getAllSponsorships,
    getSponsorshipById,
    getSponsorshipsByCreator,
} from '~/getters'
import { ParsedSponsorship, SponsorshipParser } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'
import useTokenInfo from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'
import { Chain, ChartPeriod } from '~/types'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { editSponsorshipFunding } from '~/utils/sponsorships'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { isRejectionReason } from '~/modals/BaseModal'
import { FlagBusy } from '~/utils/errors'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import { Layer } from '~/utils/Layer'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import { getBalanceForSponsorship } from '~/utils/sponsorships'
import { getQueryClient } from '~/utils'
import { getSigner } from '~/shared/stores/wallet'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fundSponsorshipModal } from '~/modals/FundSponsorshipModal'
import { getSponsorshipStats } from '~/getters/getSponsorshipStats'
import { invalidateSponsorshipFundingHistoryQueries } from '~/hooks/useSponsorshipFundingHistoryQuery'

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

export function invalidateSponsorshipsForCreatorQueries(address: string | undefined) {
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
        streamId,
        orderBy,
        orderDirection,
    }: {
        pageSize?: number
        streamId?: string
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
            streamId,
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
                        streamId,
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

export function invalidateAllSponsorshipsQueries() {
    return getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllSponsorshipsQuery'],
        refetchType: 'active',
    })
}

export function useAllSponsorshipsQuery({
    pageSize = 10,
    streamId,
    orderBy,
    orderDirection,
}: {
    pageSize?: number
    streamId?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    return useInfiniteQuery({
        queryKey: [
            'useAllSponsorshipsQuery',
            pageSize,
            streamId,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
            const sponsorships = await getSponsorshipsAndParse(
                () =>
                    getAllSponsorships({
                        first: pageSize,
                        skip,
                        streamId,
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

export function invalidateSponsorshipByIdQueries(sponsorshipId: string) {
    return getQueryClient().invalidateQueries({
        exact: true,
        queryKey: ['useSponsorshipByIdQuery', sponsorshipId],
        refetchType: 'active',
    })
}

export function useSponsorshipByIdQuery(sponsorshipId: string) {
    return useQuery({
        queryKey: ['useSponsorshipByIdQuery', sponsorshipId],
        async queryFn() {
            let rawSponsorship: Sponsorship | undefined | null

            try {
                rawSponsorship = (await getSponsorshipById(sponsorshipId, {
                    force: true,
                })) as Sponsorship | null
            } catch (e) {
                console.warn('Failed to fetch a Sponsorship', e)

                errorToast({ title: 'Could not fetch Sponsorship details' })
            }

            if (!rawSponsorship) {
                return null
            }

            try {
                return SponsorshipParser.parseAsync(rawSponsorship)
            } catch (e) {
                console.warn('Failed to parse a Sponsorship', e)

                errorToast({ title: 'Could not parse Sponsorship details' })
            }

            return null
        },
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

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

export function useCreateSponsorship() {
    const withFlag = useFlagger()

    return useCallback(
        (wallet: string | undefined, options: { onDone?: () => void } = {}) => {
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

                                await createSponsorshipModal.pop({
                                    balance,
                                })
                            },
                        )

                        await waitForGraphSync()

                        invalidateSponsorshipsForCreatorQueries(wallet)

                        invalidateAllSponsorshipsQueries()

                        options.onDone?.()
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

export function invalidateSponsorshipDailyBucketsQueries(sponsorshipId: string) {
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
                            () => joinSponsorshipModal.pop({ sponsorship, operator }),
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

                    await waitForGraphSync()

                    onJoin?.()
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

export function useEditSponsorshipFunding() {
    const withFlag = useFlagger()

    type params = Parameters<typeof editSponsorshipFunding>

    return useCallback(
        ({ sponsorship, operator }: { sponsorship: params[0]; operator: params[1] }) =>
            withFlag(
                flagKey('isEditingSponsorshipFunding', sponsorship.id, operator.id),
                () => editSponsorshipFunding(sponsorship, operator),
            ),
        [withFlag],
    )
}

export const mapSponsorshipOrder = (columnKey?: string): Sponsorship_OrderBy => {
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
export async function invalidateSponsorshipQueries(
    invalidator: string | undefined,
    sponsorshipId: string | undefined,
) {
    if (!invalidator || !sponsorshipId) {
        return
    }

    await invalidateSponsorshipsForCreatorQueries(invalidator)

    await invalidateAllSponsorshipsQueries()

    await invalidateSponsorshipByIdQueries(sponsorshipId)

    await invalidateSponsorshipDailyBucketsQueries(sponsorshipId)

    await invalidateSponsorshipFundingHistoryQueries(sponsorshipId)
}
