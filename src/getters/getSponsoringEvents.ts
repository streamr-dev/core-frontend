import { format } from 'date-fns'
import {
    GetSponsoringEventsDocument,
    GetSponsoringEventsQuery,
    GetSponsoringEventsQueryVariables,
} from '~/generated/gql/network'
import { getGraphClient } from '~/getters/getGraphClient'
import { FundingEvent } from '~/types/fundingEvent'

export const getSponsoringEvents = async (
    chainId: number,
    sponsorshipId: string,
    first: number,
    skip = 0,
    { force = false } = {},
): Promise<FundingEvent[]> => {
    const {
        data: { sponsoringEvents },
    } = await getGraphClient(chainId).query<
        GetSponsoringEventsQuery,
        GetSponsoringEventsQueryVariables
    >({
        query: GetSponsoringEventsDocument,
        variables: {
            sponsorshipId,
            first,
            skip,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return sponsoringEvents.map((event) => ({
        id: event.id,
        amount: BigInt(event.amount),
        sponsor: event.sponsor,
        date: format(new Date(Number(event.date) * 1000), 'yyyy-MM-dd HH:mm:ss'),
    }))
}
