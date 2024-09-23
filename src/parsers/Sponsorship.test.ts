import { Sponsorship } from './Sponsorship'

function parse(raw: unknown) {
    return Sponsorship.parse(raw, 137)
}

const now = Date.now()

const nowInSeconds = Math.floor(now / 1000)

const valid = {
    id: 'SPONSORSHIP_ID',
    cumulativeSponsoring: '1337',
    isRunning: true,
    minOperators: 1,
    maxOperators: 2,
    minimumStakingPeriodSeconds: 63,
    operatorCount: 42,
    projectedInsolvency: `${nowInSeconds}`,
    remainingWei: '101',
    remainingWeiUpdateTimestamp: `${nowInSeconds - 2}`,
    spotAPY: 0.12,
    stream: {
        id: 'STREAM_ID',
    },
    stakes: [],
    totalPayoutWeiPerSec: '1',
    totalStakedWei: '1000',
}

describe('parse', () => {
    it('correctly parses a valid payload', () => {
        const result = parse(valid)

        expect(result.id).toEqual('SPONSORSHIP_ID')

        expect(result.cumulativeSponsoring).toEqual(1337n)

        expect(result.minOperators).toEqual(1)

        expect(result.maxOperators).toEqual(2)

        expect(result.minimumStakingPeriodSeconds).toEqual(63)

        expect(result.operatorCount).toEqual(42)

        expect(result.spotApy).toEqual(0.12)

        expect(result.totalStakedWei).toEqual(1000n)

        expect(result.payoutPerSecond).toEqual(1n)

        expect(result.payoutPerDay).toEqual(86400n)

        expect(result.projectedInsolvencyAt?.getTime()).toEqual(now - (now % 1000))

        expect(result.remainingBalanceWei).toEqual(101n)

        expect(result.remainingBalanceUpdatedAt?.getTime()).toEqual(
            now - (now % 1000) - 2000,
        )

        expect(result.timeCorrectedRemainingBalanceWeiAt(now)).toEqual(99n)

        expect(result.stakes).toMatchObject([])

        expect(result.streamId).toEqual('STREAM_ID')

        expect(result.isRunning).toEqual(true)
    })

    it('parses id', () => {
        const { id: _, ...rest } = valid

        expect(() => parse({ ...rest })).toThrow(/failed to parse/i)

        expect(parse({ ...rest, id: '' })).toMatchObject({
            id: '',
        })

        expect(() => parse({ ...rest, id: 123 })).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: undefined })).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: null })).toThrow(/failed to parse/i)
    })

    it('parses cumulativeSponsoring', () => {
        const { cumulativeSponsoring: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            cumulativeSponsoring: 0n,
        })

        expect(parse({ cumulativeSponsoring: '', ...rest })).toMatchObject({
            cumulativeSponsoring: 0n,
        })

        expect(parse({ cumulativeSponsoring: '-1', ...rest })).toMatchObject({
            cumulativeSponsoring: -1n,
        })

        expect(parse({ cumulativeSponsoring: null, ...rest })).toMatchObject({
            cumulativeSponsoring: 0n,
        })

        expect(parse({ cumulativeSponsoring: undefined, ...rest })).toMatchObject({
            cumulativeSponsoring: 0n,
        })
    })

    it('parses minOperators', () => {
        const { minOperators: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            minOperators: 0,
        })

        expect(parse({ ...rest, minOperators: '1' })).toMatchObject({
            minOperators: 1,
        })

        expect(parse({ ...rest, minOperators: '' })).toMatchObject({
            minOperators: 0,
        })

        expect(parse({ ...rest, minOperators: -1 })).toMatchObject({
            minOperators: 0,
        })

        expect(parse({ ...rest, minOperators: null })).toMatchObject({
            minOperators: 0,
        })

        expect(parse({ ...rest, minOperators: undefined })).toMatchObject({
            minOperators: 0,
        })
    })

    it('parses maxOperators', () => {
        const { maxOperators: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            maxOperators: Infinity,
        })

        expect(parse({ ...rest, maxOperators: '1' })).toMatchObject({
            maxOperators: 1,
        })

        expect(parse({ ...rest, maxOperators: '' })).toMatchObject({
            maxOperators: 0,
        })

        expect(parse({ ...rest, maxOperators: -1 })).toMatchObject({
            maxOperators: Infinity,
        })

        expect(parse({ ...rest, maxOperators: null })).toMatchObject({
            maxOperators: 0,
        })

        expect(parse({ ...rest, maxOperators: undefined })).toMatchObject({
            maxOperators: Infinity,
        })
    })

    it('parses minimumStakingPeriodSeconds', () => {
        const { minimumStakingPeriodSeconds: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: '-1' })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: '' })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: undefined })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: null })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: false })).toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        expect(parse({ ...rest, minimumStakingPeriodSeconds: true })).toMatchObject({
            minimumStakingPeriodSeconds: 1,
        })
    })

    it('parses operatorCount', () => {
        const { operatorCount: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            operatorCount: 0,
        })

        expect(parse({ ...rest, operatorCount: '' })).toMatchObject({
            operatorCount: 0,
        })

        expect(parse({ ...rest, operatorCount: '1' })).toMatchObject({
            operatorCount: 1,
        })

        expect(parse({ ...rest, operatorCount: true })).toMatchObject({
            operatorCount: 1,
        })

        expect(parse({ ...rest, operatorCount: false })).toMatchObject({
            operatorCount: 0,
        })

        expect(parse({ ...rest, operatorCount: null })).toMatchObject({
            operatorCount: 0,
        })

        expect(parse({ ...rest, operatorCount: undefined })).toMatchObject({
            operatorCount: 0,
        })

        expect(parse({ ...rest, operatorCount: -1 })).toMatchObject({
            operatorCount: 0,
        })
    })

    it('parses spotAPY', () => {
        const { spotAPY: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            spotApy: 0,
        })

        expect(parse({ ...rest, spotAPY: '' })).toMatchObject({
            spotApy: 0,
        })

        expect(parse({ ...rest, spotAPY: '0.3' })).toMatchObject({
            spotApy: 0.3,
        })

        expect(parse({ ...rest, spotAPY: null })).toMatchObject({
            spotApy: 0,
        })

        expect(parse({ ...rest, spotAPY: undefined })).toMatchObject({
            spotApy: 0,
        })

        expect(parse({ ...rest, spotAPY: true })).toMatchObject({
            spotApy: 1,
        })

        expect(parse({ ...rest, spotAPY: false })).toMatchObject({
            spotApy: 0,
        })
    })

    it('parses totalStakedWei', () => {
        const { totalStakedWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            totalStakedWei: 0n,
        })

        expect(parse({ ...rest, totalStakedWei: '' })).toMatchObject({
            totalStakedWei: 0n,
        })

        expect(parse({ ...rest, totalStakedWei: '1' })).toMatchObject({
            totalStakedWei: 1n,
        })

        expect(parse({ ...rest, totalStakedWei: null })).toMatchObject({
            totalStakedWei: 0n,
        })

        expect(parse({ ...rest, totalStakedWei: undefined })).toMatchObject({
            totalStakedWei: 0n,
        })

        expect(parse({ ...rest, totalStakedWei: 1 })).toMatchObject({
            totalStakedWei: 1n,
        })
    })

    it('parses totalPayoutWeiPerSec', () => {
        const { totalPayoutWeiPerSec: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            payoutPerSecond: 0n,
            payoutPerDay: 0n,
        })

        expect(parse({ ...rest, totalPayoutWeiPerSec: undefined })).toMatchObject({
            payoutPerSecond: 0n,
            payoutPerDay: 0n,
        })

        expect(parse({ ...rest, totalPayoutWeiPerSec: null })).toMatchObject({
            payoutPerSecond: 0n,
            payoutPerDay: 0n,
        })

        expect(parse({ ...rest, totalPayoutWeiPerSec: 1 })).toMatchObject({
            payoutPerSecond: 1n,
            payoutPerDay: 86400n,
        })

        expect(parse({ ...rest, totalPayoutWeiPerSec: '' })).toMatchObject({
            payoutPerSecond: 0n,
            payoutPerDay: 0n,
        })
    })

    it('parses projectedInsolvency', () => {
        const { projectedInsolvency: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            projectedInsolvencyAt: null,
        })

        expect(parse({ ...rest, projectedInsolvency: 'abc' })).toMatchObject({
            projectedInsolvencyAt: null,
        })

        expect(
            parse({ ...rest, projectedInsolvency: 1 }).projectedInsolvencyAt?.getTime(),
        ).toEqual(1000)

        expect(parse({ ...rest, projectedInsolvency: undefined })).toMatchObject({
            projectedInsolvencyAt: null,
        })

        expect(parse({ ...rest, projectedInsolvency: true })).toMatchObject({
            projectedInsolvencyAt: null,
        })

        expect(parse({ ...rest, projectedInsolvency: false })).toMatchObject({
            projectedInsolvencyAt: null,
        })
    })

    it('parses remainingWei', () => {
        const { remainingWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            remainingBalanceWei: 0n,
        })

        expect(parse({ ...rest, remainingWei: '' })).toMatchObject({
            remainingBalanceWei: 0n,
        })

        expect(parse({ ...rest, remainingWei: 1 })).toMatchObject({
            remainingBalanceWei: 1n,
        })

        expect(parse({ ...rest, remainingWei: undefined })).toMatchObject({
            remainingBalanceWei: 0n,
        })

        expect(parse({ ...rest, remainingWei: null })).toMatchObject({
            remainingBalanceWei: 0n,
        })
    })

    it('parses remainingWeiUpdateTimestamp', () => {
        const { remainingWeiUpdateTimestamp: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            remainingBalanceUpdatedAt: null,
        })

        expect(parse({ ...rest, remainingWeiUpdateTimestamp: 'abc' })).toMatchObject({
            remainingBalanceUpdatedAt: null,
        })

        expect(
            parse({
                ...rest,
                remainingWeiUpdateTimestamp: 13, // 13000ms
            }).remainingBalanceUpdatedAt?.getTime(),
        ).toEqual(13000)

        expect(parse({ ...rest, remainingWeiUpdateTimestamp: undefined })).toMatchObject({
            remainingBalanceUpdatedAt: null,
        })

        expect(parse({ ...rest, remainingWeiUpdateTimestamp: true })).toMatchObject({
            remainingBalanceUpdatedAt: null,
        })

        expect(parse({ ...rest, remainingWeiUpdateTimestamp: false })).toMatchObject({
            remainingBalanceUpdatedAt: null,
        })
    })

    it('parses stakes', () => {
        const { stakes: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: {} })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: null })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: undefined })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: '' })).toMatchObject({
            stakes: [],
        })

        const { stakes: validStakes } = parse({
            ...rest,
            stakes: [
                {
                    operator: {
                        id: 'OPERATOR_ID',
                        metadataJsonString: '{}',
                    },
                    amountWei: '200',
                    lockedWei: '100',
                    joinTimestamp: '1',
                },
            ],
        })

        const [stake] = validStakes

        expect(stake.operatorId).toEqual('OPERATOR_ID')

        expect(stake.metadata).toMatchObject({
            description: '',
            email: '',
            imageIpfsCid: undefined,
            imageUrl: undefined,
            linkedIn: '',
            name: '',
            reddit: '',
            redundancyFactor: undefined,
            telegram: '',
            twitter: '',
            url: '',
            x: '',
        })

        expect(stake.amountWei).toEqual(200n)

        expect(stake.lockedWei).toEqual(100n)

        expect(stake.joinedAt.getTime()).toEqual(1000)
    })

    it('parses stream', () => {
        const { stream: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({ streamId: undefined })

        expect(parse({ ...rest, stream: null })).toMatchObject({ streamId: undefined })

        expect(parse({ ...rest, stream: undefined })).toMatchObject({
            streamId: undefined,
        })

        expect(parse({ ...rest, stream: '' })).toMatchObject({ streamId: undefined })

        expect(parse({ ...rest, stream: 'WHATEVER' })).toMatchObject({
            streamId: undefined,
        })

        expect(
            parse({
                ...rest,
                stream: { id: 'STREAM_ID' },
            }),
        ).toMatchObject({
            streamId: 'STREAM_ID',
        })
    })

    it('parses isRunning', () => {
        const { isRunning: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            isRunning: false,
        })

        expect(parse({ ...rest, isRunning: '' })).toMatchObject({
            isRunning: false,
        })

        expect(parse({ ...rest, isRunning: null })).toMatchObject({
            isRunning: false,
        })

        expect(parse({ ...rest, isRunning: undefined })).toMatchObject({
            isRunning: false,
        })
    })

    describe('timeCorrectedRemainingBalance calculation', () => {
        it('correctly substracts the payout from the remaining balance', () => {
            const result = parse({
                ...valid,
                remainingWeiUpdateTimestamp: `${nowInSeconds - 7}`,
                totalPayoutWeiPerSec: '1',
                remainingWei: '1337',
                isRunning: true,
            })

            expect(result.timeCorrectedRemainingBalanceWeiAt(now)).toEqual(1330n)
        })

        it('gives the entire remaining balance if the sponsorship is not running', () => {
            const result = parse({
                ...valid,
                remainingWeiUpdateTimestamp: `${nowInSeconds - 7}`,
                totalPayoutWeiPerSec: '1',
                remainingWei: '1337',
                isRunning: false,
            })

            expect(result.timeCorrectedRemainingBalanceWeiAt(now)).toEqual(1337n)
        })

        it('goes down to zero and not a dime further', () => {
            const result = parse({
                ...valid,
                remainingWeiUpdateTimestamp: `${nowInSeconds - 2000}`,
                totalPayoutWeiPerSec: '1',
                remainingWei: '1337',
                isRunning: true,
            })

            expect(result.timeCorrectedRemainingBalanceWeiAt(now)).toEqual(0n)
        })
    })
})
