import { useQuery } from '@tanstack/react-query'
import { Sponsorship } from '~/generated/gql/network'
import { getSponsorshipById } from '~/getters'
import { getConfigFromChain } from '~/getters/getConfigFromChain'
import { errorToast } from '~/utils/toast'
import { toBN } from '~/utils/bn'
import getSponsorshipTokenInfo from '../getters/getSponsorshipTokenInfo'
import { mapSponsorshipToElement } from './useSponsorshipsList'

export function useSponsorship(sponsorshipId: string) {
    return useQuery({
        queryKey: ['getSponsorship-' + sponsorshipId],
        async queryFn() {
            try {
                const tokenInfo = await getSponsorshipTokenInfo()
                const sponsorship = await getSponsorshipById(sponsorshipId)
                const configFromChain = await getConfigFromChain()

                return sponsorship
                    ? {
                          ...mapSponsorshipToElement(
                              sponsorship as Sponsorship,
                              Number(tokenInfo.decimals.toString()),
                              toBN(configFromChain.minimumStakeWei)
                                  .dividedBy(
                                      Math.pow(10, Number(tokenInfo.decimals.toString())),
                                  )
                                  .toString(),
                          ),
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
