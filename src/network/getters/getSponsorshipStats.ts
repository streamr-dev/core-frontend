import moment from 'moment'
import { ChartPeriod } from '~/shared/components/NetworkChart/NetworkChart'
import { GetSponsorshipDailyBucketsQuery } from '~/generated/gql/network'
import { getSponsorshipDailyBuckets } from '~/network/getters/getSponsorshipDailyBuckets'
import { toBN } from '~/utils/bn'
import { getSponsorshipTokenInfo } from '~/network/getters/getSponsorshipTokenInfo'
import { TokenInformation } from '~/marketplace/utils/web3'

export const getSponsorshipStats = async (
    sponsorshipId: string,
    selectedPeriod: ChartPeriod,
    dataSource: string,
    ignoreToday?: boolean,
): Promise<{ x: number; y: number }[]> => {
    const tokenInfo = (await getSponsorshipTokenInfo()) as TokenInformation
    const todayUTC = moment().utc().startOf('day').format('X')
    let result: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets']
    switch (selectedPeriod) {
        case ChartPeriod.SevenDays:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                7,
                0,
                ignoreToday ? todayUTC : undefined,
            )
            break
        case ChartPeriod.OneMonth:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                30,
                0,
                ignoreToday ? todayUTC : undefined,
            )
            break
        case ChartPeriod.ThreeMonths:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                90,
                0,
                ignoreToday ? todayUTC : undefined,
            )
            break
        case ChartPeriod.OneYear:
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                365,
                0,
                ignoreToday ? todayUTC : undefined,
            )
            break
        case ChartPeriod.YearToDate:
            const today = moment()
            const beginningOfYear = moment().startOf('year')
            const daySpan = today.diff(beginningOfYear, 'day')
            if (daySpan === 0) {
                result = []
                break
            }
            result = await getSponsorshipDailyBuckets(
                sponsorshipId,
                daySpan,
                0,
                ignoreToday ? todayUTC : undefined,
            )
            break
        case ChartPeriod.All:
            const maxAmount = 999
            let elements: GetSponsorshipDailyBucketsQuery['sponsorshipDailyBuckets'] = []
            // yeah - I'm guessing we will not have a history longer than 5 thousand days :)
            for (let i = 0; i < 5; i++) {
                const partialResult = await getSponsorshipDailyBuckets(
                    sponsorshipId,
                    maxAmount,
                    maxAmount * i,
                    ignoreToday ? todayUTC : undefined,
                )
                elements = [...elements, ...partialResult]
                if (partialResult.length < maxAmount) {
                    break
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
                    .dividedBy(Math.pow(10, Number(tokenInfo.decimals.toString())))
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
