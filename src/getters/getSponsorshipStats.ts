import moment from 'moment'
import { ChartPeriod } from '~/types'
import { GetSponsorshipDailyBucketsQuery } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getSponsorshipDailyBuckets } from '~/getters'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'

export const getSponsorshipStats = async (
    sponsorshipId: string,
    selectedPeriod: ChartPeriod,
    dataSource: string,
    ignoreToday?: boolean,
): Promise<{ x: number; y: number }[]> => {
    const tokenInfo = await getSponsorshipTokenInfo()
    const start = ignoreToday ? moment().utc().startOf('day') : moment().utc()

    let result: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']
    switch (selectedPeriod) {
        case ChartPeriod.SevenDays:
            result = await getSponsorshipDailyBuckets(sponsorshipId, {
                dateGreaterEqualThan: start.clone().subtract(7, 'days').unix(),
                dateLowerThan: start.unix(),
            })
            break
        case ChartPeriod.OneMonth:
            result = await getSponsorshipDailyBuckets(sponsorshipId, {
                dateGreaterEqualThan: start.clone().subtract(30, 'days').unix(),
                dateLowerThan: start.unix(),
            })
            break
        case ChartPeriod.ThreeMonths:
            result = await getSponsorshipDailyBuckets(sponsorshipId, {
                dateGreaterEqualThan: start.clone().subtract(90, 'days').unix(),
                dateLowerThan: start.unix(),
            })
            break
        case ChartPeriod.OneYear:
            result = await getSponsorshipDailyBuckets(sponsorshipId, {
                dateGreaterEqualThan: start.clone().subtract(365, 'days').unix(),
                dateLowerThan: start.unix(),
            })
            break
        case ChartPeriod.YearToDate:
            result = await getSponsorshipDailyBuckets(sponsorshipId, {
                dateGreaterEqualThan: start.clone().startOf('year').unix(),
                dateLowerThan: start.unix(),
            })
            break
        case ChartPeriod.All:
            const maxAmount = 999
            const maxIterations = 5
            const endDate = start.clone().subtract(maxIterations * maxAmount, 'days')
            const elements: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets'] =
                []
            // yeah - I'm guessing we will not have a history longer than 5 thousand days :)
            for (let i = 0; i < maxIterations; i++) {
                const partialResult = await getSponsorshipDailyBuckets(sponsorshipId, {
                    dateLowerThan: start.unix(),
                    dateGreaterEqualThan: endDate.unix(),
                    batchSize: maxAmount,
                    skip: maxAmount * i,
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
        let yValue: number
        switch (dataSource) {
            case 'amountStaked':
                yValue = toBN(bucket.totalStakedWei)
                    .dividedBy(Math.pow(10, Number(tokenInfo?.decimals.toString())))
                    .toNumber()
                break
            case 'numberOfOperators':
                yValue = Number(bucket.operatorCount)
                break
            case 'apy':
                yValue = Number(bucket.spotAPY)
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
