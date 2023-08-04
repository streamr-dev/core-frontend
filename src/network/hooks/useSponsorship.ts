import { useQuery } from '@tanstack/react-query'
import { Sponsorship } from '~/generated/gql/network'
import { getSponsorshipById } from '~/getters'
import { getConfigFromChain } from '~/getters/getConfigFromChain'
import { errorToast } from '~/utils/toast'
import { toBN } from '~/utils/bn'
import { mapSponsorshipToElement } from './useSponsorshipsList'

export function useSponsorship(sponsorshipId: string) {
    return useQuery({
        queryKey: ['getSponsorship-' + sponsorshipId],
        async queryFn() {
            try {
                const sponsorship = await getSponsorshipById(sponsorshipId)
                const configFromChain = await getConfigFromChain()

                // todo fetch token info and provide its decimals value
                return sponsorship
                    ? {
                          ...mapSponsorshipToElement(sponsorship as Sponsorship, 18),
                          minimumStake: toBN(configFromChain.minimumStakeWei)
                              .dividedBy(1e18)
                              .toString(),
                      }
                    : null
            } catch (e) {
                errorToast({ title: 'Could not fetch sponsorship details' })
                return null
            }
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
