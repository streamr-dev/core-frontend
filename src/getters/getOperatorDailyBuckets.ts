import getGraphClient from '~/getters/getGraphClient'
import {
    GetOperatorDailyBucketsDocument,
    GetOperatorDailyBucketsQuery,
    GetOperatorDailyBucketsQueryVariables,
    OperatorDailyBucket_Filter,
} from '~/generated/gql/network'

export const getOperatorBuckets = async (
    operatorId: string,
    dateLowerThan: number, // utc unix timestamp
    dateGreaterEqualThan: number, // utc unix timestamp
    first = 999,
    skip = 0,
): Promise<GetOperatorDailyBucketsQuery['operatorDailyBuckets']> => {
    const where: OperatorDailyBucket_Filter = {
        operator_: {
            id: operatorId,
        },
        date_lt: dateLowerThan,
        date_gte: dateGreaterEqualThan,
    }

    const {
        data: { operatorDailyBuckets },
    } = await getGraphClient().query<
        GetOperatorDailyBucketsQuery,
        GetOperatorDailyBucketsQueryVariables
    >({
        query: GetOperatorDailyBucketsDocument,
        variables: {
            first,
            skip,
            where,
        },
    })
    return operatorDailyBuckets
}
