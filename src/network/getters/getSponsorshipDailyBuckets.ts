import getGraphClient from '~/getters/getGraphClient'
import {
    GetSponsorshipDailyBucketsDocument,
    GetSponsorshipDailyBucketsQuery,
    GetSponsorshipDailyBucketsQueryVariables,
} from '~/generated/gql/network'

export const getSponsorshipDailyBuckets = async (
    sponsorshipId: string,
    first: number,
    skip = 0,
): Promise<GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']> => {
    const {
        data: { sponsorshipDailyBuckets },
    } = await getGraphClient().query<
        GetSponsorshipDailyBucketsQuery,
        GetSponsorshipDailyBucketsQueryVariables
    >({
        query: GetSponsorshipDailyBucketsDocument,
        variables: {
            first,
            skip,
            sponsorshipId,
        },
    })
    return sponsorshipDailyBuckets
}
