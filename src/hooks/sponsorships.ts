import { useCallback } from 'react'
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import { config } from '@streamr/config'
import { Sponsorship } from '~/generated/gql/network'
import {
    getAllSponsorships,
    getSponsorshipById,
    getSponsorshipsByCreator,
} from '~/getters'
import { ParsedSponsorship, SponsorshipParser } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'
import useTokenInfo from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'
import { Chain } from '~/shared/types/web3-types'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import {
    createSponsorship,
    editSponsorshipFunding,
    fundSponsorship,
    joinSponsorshipAsOperator,
} from '~/utils/sponsorships'
import { ParsedOperator } from '~/parsers/OperatorParser'

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

export function useSponsorshipsForCreatorQuery(
    address: string | undefined,
    { pageSize = 10, streamId }: { pageSize?: number; streamId?: string } = {},
): UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }> {
    const creator = address?.toLowerCase() || ''

    return useInfiniteQuery({
        queryKey: ['useSponsorshipsForCreatorQuery', pageSize, creator, streamId],
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

export function useAllSponsorshipsQuery({
    pageSize = 10,
    streamId,
}: {
    pageSize?: number
    streamId?: string
}) {
    return useInfiniteQuery({
        queryKey: ['useAllSponsorshipsQuery', pageSize, streamId],
        async queryFn({ pageParam: skip = 0 }) {
            const sponsorships = await getSponsorshipsAndParse(
                () =>
                    getAllSponsorships({
                        first: pageSize,
                        skip,
                        streamId,
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

export function useSponsorshipQuery(sponsorshipId: string) {
    return useQuery({
        queryKey: ['useSponsorshipQuery', sponsorshipId],
        async queryFn() {
            let rawSponsorship: Sponsorship | undefined | null

            try {
                rawSponsorship = (await getSponsorshipById(
                    sponsorshipId,
                )) as Sponsorship | null
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

export function useCreateSponsorship() {
    const withFlag = useFlagger()

    return useCallback(
        (wallet: string) =>
            withFlag(flagKey('isCreatingSponsorship', wallet), () =>
                createSponsorship(wallet),
            ),
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

export function useFundSponsorship() {
    const withFlag = useFlagger()

    return useCallback(
        ({ sponsorship, wallet }: { sponsorship: ParsedSponsorship; wallet: string }) =>
            withFlag(flagKey('isFundingSponsorship', sponsorship.id, wallet), () =>
                fundSponsorship(
                    sponsorship.id,
                    sponsorship.payoutPerDay.toString(),
                    wallet,
                ),
            ),
        [withFlag],
    )
}

export function useIsJoiningSponsorshipAsOperator(
    sponsorshipId: string | undefined,
    operatorId: string | undefined,
    streamId: string | undefined,
) {
    return useIsFlagged(
        flagKey(
            'isJoiningSponsorshipAsOperator',
            sponsorshipId || '',
            operatorId || '',
            streamId || '',
        ),
    )
}

export function useJoinSponsorshipAsOperator() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            sponsorship: { id: sponsorshipId, streamId },
            operator,
        }: {
            sponsorship: ParsedSponsorship
            operator: ParsedOperator
        }) =>
            withFlag(
                flagKey(
                    'isJoiningSponsorshipAsOperator',
                    sponsorshipId,
                    operator.id,
                    streamId,
                ),
                () => joinSponsorshipAsOperator(sponsorshipId, operator, streamId),
            ),
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

    return useCallback(
        ({
            sponsorship,
            operator,
        }: {
            sponsorship: ParsedSponsorship
            operator: ParsedOperator
        }) =>
            withFlag(
                flagKey('isEditingSponsorshipFunding', sponsorship.id, operator.id),
                () => editSponsorshipFunding(sponsorship, operator),
            ),
        [withFlag],
    )
}
