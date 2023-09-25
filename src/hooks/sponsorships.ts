import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { getSponsorshipsByCreator } from '~/getters'
import { ParsedSponsorship, SponsorshipParser } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'

export function useSponsorshipsForCreatorQuery(
    address: string | undefined,
    { pageSize = 10, streamId }: { pageSize?: number; streamId?: string } = {},
): UseInfiniteQueryResult<{ page: number; sponsorships: ParsedSponsorship[] }> {
    const creator = address?.toLowerCase() || ''

    return useInfiniteQuery({
        queryKey: ['sponsorshipsForCreator', creator, streamId],
        async queryFn({ pageParam: page = 0 }) {
            if (!creator) {
                return {
                    page,
                    sponsorships: [],
                }
            }

            const sponsorships: ParsedSponsorship[] = []

            let preparsedCount = 0

            try {
                const rawSponsorships = await getSponsorshipsByCreator(creator, {
                    first: pageSize,
                    skip: page * pageSize,
                    streamId,
                })

                preparsedCount = rawSponsorships.length

                for (let i = 0; i < rawSponsorships.length; i++) {
                    try {
                        sponsorships.push(
                            await SponsorshipParser.parseAsync(rawSponsorships[i]),
                        )
                    } catch (e) {
                        console.warn('Failed to parse a sponsorship', e)
                    }
                }
            } catch (e) {
                console.warn('Could not fetch the sponsorships list', e)

                errorToast({ title: 'Could not fetch the sponsorships list' })
            }

            if (preparsedCount !== sponsorships.length) {
                errorToast({
                    title: 'Failed to parse',
                    desc: `${
                        preparsedCount - sponsorships.length
                    } out of ${preparsedCount} sponsorships could not be parsed.`,
                })
            }

            return {
                page,
                sponsorships,
            }
        },
        getNextPageParam: ({ sponsorships, page }) => {
            return sponsorships.length === pageSize ? page + 1 : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
