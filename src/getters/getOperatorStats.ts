import moment from 'moment'
import { GetOperatorDailyBucketsQuery } from '~/generated/gql/network'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { ChartPeriod } from '~/types'
import { toFloat } from '~/utils/bn'
import { getOperatorDailyBuckets } from '.'

export const getOperatorStats = async (
    chainId: number,
    operatorId: string,
    selectedPeriod: ChartPeriod,
    dataSource: string,
    { force = false, ignoreToday = false } = {},
): Promise<{ x: number; y: number }[]> => {
    const { decimals = 18n } = await getSponsorshipTokenInfo(chainId)

    const start = ignoreToday ? moment().utc().startOf('day') : moment().utc()

    let result: GetOperatorDailyBucketsQuery['operatorDailyBuckets']
    switch (selectedPeriod) {
        case ChartPeriod.SevenDays:
            result = await getOperatorDailyBuckets(chainId, operatorId, {
                dateGreaterEqualThan: start.clone().subtract(7, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.OneMonth:
            result = await getOperatorDailyBuckets(chainId, operatorId, {
                dateGreaterEqualThan: start.clone().subtract(30, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.ThreeMonths:
            result = await getOperatorDailyBuckets(chainId, operatorId, {
                dateGreaterEqualThan: start.clone().subtract(90, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.OneYear:
            result = await getOperatorDailyBuckets(chainId, operatorId, {
                dateGreaterEqualThan: start.clone().subtract(365, 'days').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.YearToDate:
            result = await getOperatorDailyBuckets(chainId, operatorId, {
                dateGreaterEqualThan: start.clone().startOf('year').unix(),
                dateLowerThan: start.unix(),
                force,
            })
            break
        case ChartPeriod.All:
            const maxAmount = 999
            const maxIterations = 5
            const endDate = start.clone().subtract(maxIterations * maxAmount, 'days')
            const elements: GetOperatorDailyBucketsQuery['operatorDailyBuckets'] = []
            // yeah - I'm guessing we will not have a history longer than 5 thousand days :)
            for (let i = 0; i < maxIterations; i++) {
                const partialResult = await getOperatorDailyBuckets(chainId, operatorId, {
                    dateGreaterEqualThan: endDate.unix(),
                    dateLowerThan: start.unix(),
                    batchSize: maxAmount,
                    skip: maxAmount * i,
                    force,
                })

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
        const yValue =
            dataSource === 'totalValue'
                ? toFloat(bucket.valueWithoutEarnings, decimals).toNumber()
                : dataSource === 'cumulativeEarnings'
                ? toFloat(bucket.cumulativeEarningsWei, decimals).toNumber()
                : 0

        return {
            x: Number(bucket.date) * 1000,
            y: yValue,
        }
    })
}
