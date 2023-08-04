import getGraphClient from '~/getters/getGraphClient'
import {
    GetSponsorshipDailyBucketsDocument,
    GetSponsorshipDailyBucketsQuery,
    GetSponsorshipDailyBucketsQueryVariables,
    SponsorshipDailyBucket_Filter,
} from '~/generated/gql/network'

export const getSponsorshipDailyBuckets = async (
    sponsorshipId: string,
    first: number,
    skip = 0,
    dateLowerThan?: string, // utc timestamp in seconds
): Promise<GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']> => {
    const where: SponsorshipDailyBucket_Filter = { sponsorship_: { id: sponsorshipId } }
    if (dateLowerThan) {
        where.date_lt = dateLowerThan
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
