import { useQuery } from '@tanstack/react-query'
import {
    GetSponsorshipByIdQueryResult,
    Sponsorship,
    useGetSponsorshipByIdLazyQuery,
} from '~/gql'
import { mapSponsorshipToElement } from './useSponsorshipsList'

export const useSponsorship = (sponsorshipId: string) => {
    const [loadSponsorship] = useGetSponsorshipByIdLazyQuery()
    const query = useQuery({
        queryKey: ['getSponsorship-' + sponsorshipId],
        queryFn: async (ctx) => {
            const queryResult: GetSponsorshipByIdQueryResult = await loadSponsorship({
                variables: {
                    sponsorshipId,
                },
            })

            if (!queryResult?.data?.sponsorship) {
                return null
            }

            return mapSponsorshipToElement(queryResult.data.sponsorship as Sponsorship)

            /*return queryResult?.data?.sponsorships
                ? queryResult?.data?.sponsorships.map((sponsorship) =>
                      mapSponsorshipToElement(sponsorship as Sponsorship),
                  )
                : []*/
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
    return query
}
