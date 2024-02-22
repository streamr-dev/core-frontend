import { useCallback, useEffect, useRef } from 'react'
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import { OrderDirection, Sponsorship, Sponsorship_OrderBy } from '~/generated/gql/network'
import {
    getAllSponsorships,
    getParsedSponsorshipById,
    getSponsorshipsByCreator,
    getSponsorshipsByStreamId,
} from '~/getters'
import { ParsedSponsorship, parseSponsorship } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'
import useTokenInfo from '~/hooks/useTokenInfo'
import { ChartPeriod } from '~/types'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { getSponsorshipLeavePenalty } from '~/utils/sponsorships'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { isRejectionReason } from '~/utils/exceptions'
import { FlagBusy } from '~/utils/errors'
import { joinSponsorshipModal } from '~/modals/JoinSponsorshipModal'
import { createSponsorshipModal } from '~/modals/CreateSponsorshipModal'
import { getBalanceForSponsorship } from '~/utils/sponsorships'
import { getQueryClient } from '~/utils'
import { getSigner } from '~/shared/stores/wallet'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { fundSponsorshipModal } from '~/modals/FundSponsorshipModal'
import { getSponsorshipStats } from '~/getters/getSponsorshipStats'
import { invalidateSponsorshipFundingHistoryQueries } from '~/hooks/useSponsorshipFundingHistoryQuery'
import { invalidateActiveOperatorByIdQueries } from '~/hooks/operators'
import { editStakeModal } from '~/modals/EditStakeModal'
import { useCurrentChain, useCurrentChainId } from '~/shared/stores/chain'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'
import { useRequestedBlockNumber } from '.'
import { BehindIndexError } from '~/errors/BehindIndexError'

function getDefaultQueryParams(pageSize: number) {
    return {
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    }
}

async function getSponsorshipsAndParse(
    chainId: number,
    getter: () => Promise<Sponsorship[]>,
) {
    const sponsorships: ParsedSponsorship[] = []

    let preparsedCount = 0

    try {
        const rawSponsorships = await getter()

        preparsedCount = rawSponsorships.length

        for (let i = 0; i < rawSponsorships.length; i++) {
            try {
                sponsorships.push(
                    await parseSponsorship(rawSponsorships[i], {
                        chainId,
                    }),
                )
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
    }: {
        pageSize?: number
        searchQuery?: string
        orderBy?: string
        orderDirection?: 'asc' | 'desc'
    } = {},
): UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }> {
    const currentChainId = useCurrentChainId()

    const creator = address?.toLowerCase() || ''

    return useInfiniteQuery({
        queryKey: [
            'useSponsorshipsForCreatorQuery',
            currentChainId,
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
                currentChainId,
                () =>
                    getSponsorshipsByCreator(currentChainId, creator, {
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
}: {
    pageSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const currentChainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: [
            'useAllSponsorshipsQuery',
            currentChainId,
            pageSize,
            searchQuery,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
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

    const initialBehindBlockErrorRef = useRef<BehindIndexError | null>(null)

    const sponsorshipIdRef = useRef(sponsorshipId)

    if (sponsorshipIdRef.current !== sponsorshipId) {
        sponsorshipIdRef.current = sponsorshipId

        /**
         * We reset the `initialBehindBlockErrorRef` for each new sponsorship id. That's the
         * whole point of reffing the id.
         */
        initialBehindBlockErrorRef.current = null
    }

    const query = useQuery({
        queryKey: [
            'useSponsorshipByIdQuery',
            currentChainId,
            sponsorshipId.toLowerCase(),
            minBlockNumber,
        ],
        queryFn: async () => {
            let sponsorship: ParsedSponsorship | null = null

            try {
                sponsorship = await getParsedSponsorshipById(
                    currentChainId,
                    sponsorshipId,
                    {
                        force: true,
                        minBlockNumber,
                    },
                )
            } catch (e) {
                if (e instanceof BehindIndexError) {
                    if (!initialBehindBlockErrorRef.current) {
                        initialBehindBlockErrorRef.current = e
                    }

                    e.setInitialBlockNumber(
                        initialBehindBlockErrorRef.current?.actualBlockNumber,
                        { overwrite: false },
                    )
                }

                throw e
            }

            return sponsorship
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    const isBehindError = query.error instanceof BehindIndexError

    useEffect(
        function refetchQueryOnBehindBlockError() {
            if (!isBehindError) {
                return
            }

            const timeoutId = setTimeout(() => {
                query.refetch()
            }, 5000)

            return () => {
                clearTimeout(timeoutId)
            }
        },
        [query, isBehindError],
    )

    return query
}

export function useSponsorshipsByStreamIdQuery({
    pageSize = 10,
    streamId,
    orderBy,
    orderDirection,
}: {
    pageSize?: number
    streamId: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const currentChainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: [
            'useSponsorshipsByStreamIdQuery',
            currentChainId,
            streamId,
            pageSize,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip = 0 }) {
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
    const { contracts, id: chainId } = useCurrentChain()

    const { sponsorshipPaymentToken } = getChainConfigExtension(chainId)

    return useTokenInfo(contracts[sponsorshipPaymentToken], chainId)
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
                                const balance = await getBalanceForSponsorship(
                                    chainId,
                                    wallet,
                                )

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
                                await getSponsorshipTokenInfo(chainId)

                                await fundSponsorshipModal.pop({
                                    chainId,
                                    sponsorship,
                                    balance: await getBalanceForSponsorship(
                                        chainId,
                                        wallet,
                                    ),
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

                                await joinSponsorshipModal.pop({
                                    chainId,
                                    sponsorship,
                                    operator,
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
            sponsorshipOrSponsorshipId: string | ParsedSponsorship
            operator: ParsedOperator
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

                                const leavePenaltyWei = await getSponsorshipLeavePenalty(
                                    chainId,
                                    sponsorship.id,
                                    operator.id,
                                )

                                await editStakeModal.pop({
                                    chainId,
                                    operator,
                                    sponsorship,
                                    leavePenaltyWei,
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
