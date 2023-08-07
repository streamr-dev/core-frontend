import getGraphClient from '~/getters/getGraphClient'
import {
    GetSponsorshipDailyBucketsDocument,
    GetSponsorshipDailyBucketsQuery,
    GetSponsorshipDailyBucketsQueryVariables,
    SponsorshipDailyBucket_Filter,
} from '~/generated/gql/network'

export const getSponsorshipDailyBuckets = async (
    sponsorshipId: string,
    dateLowerThan: string, // utc timestamp in seconds
    dateGreaterEqualThan: string, // utc timestamp in seconds
    first = 999,
    skip = 0,
): Promise<GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']> => {
    const where: SponsorshipDailyBucket_Filter = {
        sponsorship_: {
            id: sponsorshipId,
        },
        date_lt: dateLowerThan,
        date_gte: dateGreaterEqualThan,
    }

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
            where,
        },
    })
    return sponsorshipDailyBuckets
}
