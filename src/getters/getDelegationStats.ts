import moment from 'moment/moment'
import { ChartPeriod } from '~/types'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { GetDelegatorDailyBucketsQuery } from '~/generated/gql/network'
import { getDelegatorDailyBuckets } from '~/getters/index'
import { toBN } from '~/utils/bn'
import { fromDecimals } from '~/marketplace/utils/math'

export const getDelegationStats = async (
    chainId: number,
    delegatorId: string,
    selectedPeriod: ChartPeriod,
    dataSource: string,
    { force = false, ignoreToday = false } = {},
): Promise<{ x: number; y: number }[]> => {
    const tokenInfo = await getSponsorshipTokenInfo(chainId)

    const start = ignoreToday ? moment().utc().startOf('day') : moment().utc()
    let result: GetDelegatorDailyBucketsQuery['delegatorDailyBuckets']
    switch (selectedPeriod) {
        case ChartPeriod.SevenDays:
            result = await getDelegatorDailyBuckets(chainId, delegatorId, {
                dateGreaterEqualThan: start.clone().subtract(7, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.OneMonth:
            result = await getDelegatorDailyBuckets(chainId, delegatorId, {
                dateGreaterEqualThan: start.clone().subtract(30, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.ThreeMonths:
            result = await getDelegatorDailyBuckets(chainId, delegatorId, {
                dateGreaterEqualThan: start.clone().subtract(90, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.OneYear:
            result = await getDelegatorDailyBuckets(chainId, delegatorId, {
                dateGreaterEqualThan: start.clone().subtract(365, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.YearToDate:
            result = await getDelegatorDailyBuckets(chainId, delegatorId, {
                dateGreaterEqualThan: start.clone().startOf('year').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.All:
            const maxAmount = 999
            const maxIterations = 5
            const endDate = start.clone().subtract(maxIterations * maxAmount, 'days')
            const elements: GetDelegatorDailyBucketsQuery['delegatorDailyBuckets'] = []
            // yeah - I'm guessing we will not have a history longer than 5 thousand days :)
            for (let i = 0; i < maxIterations; i++) {
                const partialResult = await getDelegatorDailyBuckets(
                    chainId,
                    delegatorId,
                    {
                        dateGreaterEqualThan: endDate.unix(),
                        dateLowerThan: start.unix(),
                        batchSize: maxAmount,
                        skip: maxAmount * i,
                        force,
                    },
                )

                elements.push(...partialResult)
                if (partialResult.length < maxAmount) {
                    break // we're breaking the FOR loop here
                }
            }
            result = elements
            break
        default:
            result = []
    }

    return result.map((bucket) => {
        let yValue: number
        switch (dataSource) {
            case 'currentValue':
                yValue = fromDecimals(
                    bucket.totalValueDataWei,
                    tokenInfo?.decimals || 18,
                ).toNumber()
                break
            case 'cumulativeEarnings':
                yValue = fromDecimals(
                    bucket.cumulativeEarningsWei,
                    tokenInfo?.decimals || 18,
                ).toNumber()
                break
            default:
                yValue = 0
                break
        }
        return {
            x: toBN(bucket.date).multipliedBy(1000).toNumber(),
            y: yValue,
        }
    })
}
