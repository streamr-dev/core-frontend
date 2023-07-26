import { useQuery } from '@tanstack/react-query'
import { Sponsorship } from '~/generated/gql/network'
import { getSponsorshipById } from '~/getters'
import { mapSponsorshipToElement } from './useSponsorshipsList'

export function useSponsorship(sponsorshipId: string) {
    return useQuery({
        queryKey: ['getSponsorship-' + sponsorshipId],
        async queryFn() {
            const sponsorship = await getSponsorshipById(sponsorshipId)

            return sponsorship
                ? mapSponsorshipToElement(sponsorship as Sponsorship)
                : null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
