import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { getSponsorshipsByCreator } from '~/getters'
import { ParsedSponsorship, SponsorshipParser } from '~/parsers/SponsorshipParser'
import { errorToast } from '~/utils/toast'

export function useSponsorshipsForCreatorQuery(
    address: string | undefined,
    { pageSize = 10, streamId }: { pageSize?: number; streamId?: string } = {},
): UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }> {
    const creator = address?.toLowerCase() || ''

    return useInfiniteQuery({
        queryKey: ['sponsorshipsForCreator', creator, streamId],
        async queryFn({ pageParam: skip = 0 }) {
            if (!creator) {
                return {
                    skip,
                    sponsorships: [],
                }
            }

            const sponsorships: ParsedSponsorship[] = []

            let preparsedCount = 0

            try {
                const rawSponsorships = await getSponsorshipsByCreator(creator, {
                    first: pageSize,
                    skip,
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

            return {
                skip,
                sponsorships,
            }
        },
        getNextPageParam: ({ sponsorships, skip }) => {
            return sponsorships.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
