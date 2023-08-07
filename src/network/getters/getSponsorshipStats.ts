import moment from 'moment'
import { ChartPeriod } from '~/shared/components/NetworkChart/NetworkChart'
import { GetSponsorshipDailyBucketsQuery } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getSponsorshipDailyBuckets } from './getSponsorshipDailyBuckets'
import { getSponsorshipTokenInfo } from './getSponsorshipTokenInfo'

export const getSponsorshipStats = async (
    sponsorshipId: string,
    selectedPeriod: ChartPeriod,
    dataSource: string,
    ignoreToday?: boolean,
): Promise<{ x: number; y: number }[]> => {
    const tokenInfo = await getSponsorshipTokenInfo()
    const today = moment()
    const start = ignoreToday ? moment().utc().startOf('day') : moment().utc()

    let result: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']
    switch (selectedPeriod) {
        case ChartPeriod.SevenDays:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                start.format('X'),
                start.subtract(7, 'days').format('X'),
            )
            break
        case ChartPeriod.OneMonth:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                start.format('X'),
                start.subtract(30, 'days').format('X'),
            )
            break
        case ChartPeriod.ThreeMonths:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                start.format('X'),
                start.subtract(90, 'days').format('X'),
            )
            break
        case ChartPeriod.OneYear:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                start.format('X'),
                start.subtract(365, 'days').format('X'),
            )
            break
        case ChartPeriod.YearToDate:
            const beginningOfYear = moment().utc().startOf('year')
            const daySpan = today.utc().diff(beginningOfYear, 'day')
            if (daySpan === 0) {
                result = []
                break
            }
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                start.format('X'),
                start.subtract(daySpan, 'days').format('X'),
            )
            break
        case ChartPeriod.All:
            const maxAmount = 999
            const maxIterations = 5
            const endDate = start.subtract(maxIterations * maxAmount, 'days')
            const elements: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets'] =
                []
            // yeah - I'm guessing we will not have a history longer than 5 thousand days :)
            for (let i = 0; i < maxIterations; i++) {
                const partialResult = await getSponsorshipDailyBuckets(
                    sponsorshipId,
                    start.format('X'),
                    endDate.format('X'),
                    maxAmount,
                    maxAmount * i,
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
