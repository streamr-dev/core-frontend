import { parseSponsorship } from './SponsorshipParser'

jest.mock('~/getters/getConfigValueFromChain', () => ({
    __esModule: true,
    getConfigValueFromChain: () => 0n,
}))

const options = {
    chainId: 137,
}

const valid = {
    id: 'SPONSORSHIP_ID',
    cumulativeSponsoring: '1337',
    isRunning: true,
    minOperators: 1,
    maxOperators: 2,
    minimumStakingPeriodSeconds: 63,
    operatorCount: 42,
    projectedInsolvency: `${60 * 60 * 24.5}`, // 2nd Jan 1970 00:30
    remainingWei: '101',
    remainingWeiUpdateTimestamp: 60 * 60 * 24 + 60, // 2nd Jan 1970 00:01
    spotAPY: 0.12,
    stream: {
        id: 'STREAM_ID',
    },
    stakes: [],
    totalPayoutWeiPerSec: '1',
    totalStakedWei: '1000',
}

describe('parseSponsorship', () => {
    it('correctly parses a valid payload', async () => {
        const result = await parseSponsorship(valid, options)

        expect(result.id).toEqual('SPONSORSHIP_ID')

        expect(result.cumulativeSponsoring).toEqual(1337n)

        expect(result.minOperators).toEqual(1)

        expect(result.maxOperators).toEqual(2)

        expect(result.minimumStakingPeriodSeconds).toEqual(63)

        expect(result.operatorCount).toEqual(42)

        expect(result.spotAPY).toEqual(0.12)

        expect(result.totalStakedWei).toEqual(1000n)

        expect(result.minimumStakeWei).toEqual(0n)

        expect(result.payoutPerSec).toEqual(1n)

        expect(result.payoutPerDay).toEqual(86400n)

        expect(result.projectedInsolvencyAt).toEqual(60 * 60 * 24.5)

        expect(result.remainingBalanceWei).toEqual(101n)

        expect(result.remainingWeiUpdateTimestamp).toEqual(60 * 60 * 24 + 60)

        expect(result.timeCorrectedRemainingBalance).toEqual(101n)

        expect(result.stakes).toMatchObject([])

        expect(result.streamId).toEqual('STREAM_ID')

        expect(result.isRunning).toEqual(true)
    })

    describe('parsing issues', () => {
        it('throws on invalid id', async () => {
            const { id: _, ...rest } = valid

            await expect(parseSponsorship(rest, options)).rejects.toThrow(
                /failed to parse/i,
            )

            await expect(
                parseSponsorship({ ...rest, id: '' }, options),
            ).resolves.toMatchObject({
                id: '',
            })

            await expect(parseSponsorship({ ...rest, id: 123 }, options)).rejects.toThrow(
                /failed to parse/i,
            )

            await expect(
                parseSponsorship({ ...rest, id: undefined }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, id: null }, options),
            ).rejects.toThrow(/failed to parse/i)
        })

        it('throws on invalid cumulativeSponsoring', async () => {
            const { cumulativeSponsoring: _, ...rest } = valid

            await expect(parseSponsorship(rest, options)).rejects.toThrow(
                /failed to parse/i,
            )

            await expect(
                parseSponsorship({ cumulativeSponsoring: '', ...rest }, options),
            ).resolves.toMatchObject({
                cumulativeSponsoring: 0n,
            })

            await expect(
                parseSponsorship({ cumulativeSponsoring: '-1', ...rest }, options),
            ).resolves.toMatchObject({
                cumulativeSponsoring: -1n,
            })

            await expect(
                parseSponsorship({ cumulativeSponsoring: null, ...rest }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ cumulativeSponsoring: undefined, ...rest }, options),
            ).rejects.toThrow(/failed to parse/i)
        })

        it('throws on invalid minOperators', async () => {
            const { minOperators: _, ...rest } = valid

            await expect(parseSponsorship(rest, options)).rejects.toThrow(
                /failed to parse/i,
            )

            await expect(
                parseSponsorship({ ...rest, minOperators: '1' }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, minOperators: '' }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, minOperators: -1 }, options),
            ).resolves.toMatchObject({
                minOperators: -1,
            })

            await expect(
                parseSponsorship({ ...rest, minOperators: null }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, minOperators: undefined }, options),
            ).rejects.toThrow(/failed to parse/i)
        })

        it('throws on invalid maxOperators', async () => {
            const { maxOperators: _, ...rest } = valid

            await expect(parseSponsorship(rest, options)).resolves.toMatchObject({
                maxOperators: Infinity,
            })

            await expect(
                parseSponsorship({ ...rest, maxOperators: '1' }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, maxOperators: '' }, options),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, maxOperators: -1 }, options),
            ).resolves.toMatchObject({
                maxOperators: -1,
            })

            await expect(
                parseSponsorship({ ...rest, maxOperators: null }, options),
            ).resolves.toMatchObject({ maxOperators: Infinity })

            await expect(
                parseSponsorship({ ...rest, maxOperators: undefined }, options),
            ).resolves.toMatchObject({ maxOperators: Infinity })
        })

        it('throws on invalid minimumStakingPeriodSeconds', async () => {
            const { minimumStakingPeriodSeconds: _, ...rest } = valid

            await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
                /failed to parse/i,
            )

            await expect(
                parseSponsorship({ ...rest, minimumStakingPeriodSeconds: '-1' }, options),
            ).resolves.toMatchObject({
                minimumStakingPeriodSeconds: -1,
            })

            await expect(
                parseSponsorship({ ...rest, minimumStakingPeriodSeconds: '' }, options),
            ).resolves.toMatchObject({
                minimumStakingPeriodSeconds: 0,
            })

            await expect(
                parseSponsorship(
                    { ...rest, minimumStakingPeriodSeconds: undefined },
                    options,
                ),
            ).rejects.toThrow(/failed to parse/i)

            await expect(
                parseSponsorship({ ...rest, minimumStakingPeriodSeconds: null }, options),
            ).resolves.toMatchObject({
                minimumStakingPeriodSeconds: 0,
            })

            await expect(
                parseSponsorship(
                    { ...rest, minimumStakingPeriodSeconds: false },
                    options,
                ),
            ).resolves.toMatchObject({
                minimumStakingPeriodSeconds: 0,
            })

            await expect(
                parseSponsorship({ ...rest, minimumStakingPeriodSeconds: true }, options),
            ).resolves.toMatchObject({
                minimumStakingPeriodSeconds: 1,
            })
        })

        it('throws on invalid operatorCount', async () => {})

        it('throws on invalid spotAPY', async () => {})

        it('throws on invalid totalStakedWei', async () => {})

        it('throws on invalid minimumStakeWei', async () => {})

        it('throws on invalid payoutPerSec', async () => {})

        it('throws on invalid payoutPerDay', async () => {})

        it('throws on invalid projectedInsolvencyAt', async () => {})

        it('throws on invalid remainingBalanceWei', async () => {})

        it('throws on invalid remainingWeiUpdateTimestamp', async () => {})

        it('throws on invalid timeCorrectedRemainingBalance', async () => {})

        it('throws on invalid stakes', async () => {})

        it('throws on invalid streamId', async () => {})

        it('throws on invalid isRunning', async () => {})
    })
})
