import { format } from 'date-fns'
import getGraphClient from '~/getters/getGraphClient'
import { toBN } from '~/utils/bn'
import {
    GetSponsoringEventsDocument,
    GetSponsoringEventsQuery,
    GetSponsoringEventsQueryVariables,
} from '~/generated/gql/network'
import { FundingEvent } from '~/types/fundingEvent'

export const getSponsoringEvents = async (
    sponsorshipId: string,
    first: number,
    skip = 0,
): Promise<FundingEvent[]> => {
    const {
        data: { sponsoringEvents },
    } = await getGraphClient().query<
        GetSponsoringEventsQuery,
        GetSponsoringEventsQueryVariables
    >({
        query: GetSponsoringEventsDocument,
        variables: {
            sponsorshipId,
            first,
            skip,
        },
    })
    return sponsoringEvents.map((event) => ({
        id: event.id,
        amount: toBN(event.amount).dividedBy(1e18).toString(), // TODO fetch sponsorship token info here nad use it's decimals value
        sponsor: event.sponsor,
        date: format(new Date(Number(event.date) * 1000), 'yyyy-MM-dd HH:mm:ss'),
    }))
}
