import { parseSponsorship } from './SponsorshipParser'

jest.mock('~/getters/getConfigValueFromChain', () => ({
    __esModule: true,
    getConfigValueFromChain: () => 0n,
}))

const now = Math.floor(Date.now() / 1000)

const options = {
    chainId: 137,
    now: Math.floor(now * 1000),
}

const valid = {
    id: 'SPONSORSHIP_ID',
    cumulativeSponsoring: '1337',
    isRunning: true,
    minOperators: 1,
    maxOperators: 2,
    minimumStakingPeriodSeconds: 63,
    operatorCount: 42,
    projectedInsolvency: `${now}`,
    remainingWei: '101',
    remainingWeiUpdateTimestamp: `${now - 2}`,
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

        expect(result.projectedInsolvencyAt).toEqual(now)

        expect(result.remainingBalanceWei).toEqual(101n)

        expect(result.remainingWeiUpdateTimestamp).toEqual(now - 2)

        expect(result.timeCorrectedRemainingBalance).toEqual(99n)

        expect(result.stakes).toMatchObject([])

        expect(result.streamId).toEqual('STREAM_ID')

        expect(result.isRunning).toEqual(true)
    })

    it('parses id', async () => {
        const { id: _, ...rest } = valid

        await expect(parseSponsorship(rest, options)).rejects.toThrow(/failed to parse/i)

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

        await expect(parseSponsorship({ ...rest, id: null }, options)).rejects.toThrow(
            /failed to parse/i,
        )
    })

    it('parses cumulativeSponsoring', async () => {
        const { cumulativeSponsoring: _, ...rest } = valid

        await expect(parseSponsorship(rest, options)).rejects.toThrow(/failed to parse/i)

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

    it('parses minOperators', async () => {
        const { minOperators: _, ...rest } = valid

        await expect(parseSponsorship(rest, options)).rejects.toThrow(/failed to parse/i)

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

    it('parses maxOperators', async () => {
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

    it('parses minimumStakingPeriodSeconds', async () => {
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
            parseSponsorship({ ...rest, minimumStakingPeriodSeconds: false }, options),
        ).resolves.toMatchObject({
            minimumStakingPeriodSeconds: 0,
        })

        await expect(
            parseSponsorship({ ...rest, minimumStakingPeriodSeconds: true }, options),
        ).resolves.toMatchObject({
            minimumStakingPeriodSeconds: 1,
        })
    })

    it('parses operatorCount', async () => {
        const { operatorCount: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, operatorCount: '' }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: '1' }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: true }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: false }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: null }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, operatorCount: -1 }, options),
        ).resolves.toMatchObject({
            operatorCount: -1,
        })
    })

    it('parses spotAPY', async () => {
        const { spotAPY: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, spotAPY: '' }, options),
        ).resolves.toMatchObject({
            spotAPY: 0,
        })

        await expect(
            parseSponsorship({ ...rest, spotAPY: '0.3' }, options),
        ).resolves.toMatchObject({
            spotAPY: 0.3,
        })

        await expect(
            parseSponsorship({ ...rest, spotAPY: null }, options),
        ).resolves.toMatchObject({
            spotAPY: 0,
        })

        await expect(
            parseSponsorship({ ...rest, spotAPY: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, spotAPY: true }, options),
        ).resolves.toMatchObject({
            spotAPY: 1,
        })

        await expect(
            parseSponsorship({ ...rest, spotAPY: false }, options),
        ).resolves.toMatchObject({
            spotAPY: 0,
        })
    })

    it('parses totalStakedWei', async () => {
        const { totalStakedWei: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, totalStakedWei: '' }, options),
        ).resolves.toMatchObject({
            totalStakedWei: 0n,
        })

        await expect(
            parseSponsorship({ ...rest, totalStakedWei: '1' }, options),
        ).resolves.toMatchObject({
            totalStakedWei: 1n,
        })

        await expect(
            parseSponsorship({ ...rest, totalStakedWei: null }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, totalStakedWei: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, totalStakedWei: 1 }, options),
        ).rejects.toThrow(/failed to parse/i)
    })

    it('parses totalPayoutWeiPerSec', async () => {
        const { totalPayoutWeiPerSec: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, totalPayoutWeiPerSec: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, totalPayoutWeiPerSec: null }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, totalPayoutWeiPerSec: 1 }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, totalPayoutWeiPerSec: '' }, options),
        ).resolves.toMatchObject({
            payoutPerSec: 0n,
            payoutPerDay: 0n,
        })
    })

    it('parses projectedInsolvency', async () => {
        const { projectedInsolvency: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, projectedInsolvency: 'abc' }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, projectedInsolvency: 1 }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, projectedInsolvency: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, projectedInsolvency: true }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, projectedInsolvency: false }, options),
        ).rejects.toThrow(/failed to parse/i)
    })

    it('parses remainingWei', async () => {
        const { remainingWei: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, remainingWei: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, remainingWei: null }, options),
        ).rejects.toThrow(/failed to parse/i)
    })

    it('parses remainingWeiUpdateTimestamp', async () => {
        const { remainingWeiUpdateTimestamp: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, remainingWeiUpdateTimestamp: 'abc' }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, remainingWeiUpdateTimestamp: 13 }, options),
        ).resolves.toMatchObject({
            remainingWeiUpdateTimestamp: 13,
        })

        await expect(
            parseSponsorship(
                { ...rest, remainingWeiUpdateTimestamp: undefined },
                options,
            ),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, remainingWeiUpdateTimestamp: true }, options),
        ).resolves.toMatchObject({
            remainingWeiUpdateTimestamp: 1,
        })

        await expect(
            parseSponsorship({ ...rest, remainingWeiUpdateTimestamp: false }, options),
        ).resolves.toMatchObject({
            remainingWeiUpdateTimestamp: 0,
        })
    })

    it('parses stakes', async () => {
        const { stakes: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(parseSponsorship({ ...rest, stakes: {} }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, stakes: null }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, stakes: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(parseSponsorship({ ...rest, stakes: '' }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        const { stakes: validStakes } = await parseSponsorship(
            {
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
            },
            options,
        )

        const [stake] = validStakes

        expect(stake.operatorId).toEqual('OPERATOR_ID')

        expect(stake.metadata).toMatchObject({
            name: '',
            description: '',
            url: '',
            email: '',
            twitter: '',
            x: '',
            telegram: '',
            reddit: '',
            linkedIn: '',
            imageUrl: undefined,
            imageIpfsCid: undefined,
        })

        expect(stake.metadata).not.toHaveProperty('redundancyFactor')

        expect(stake.amountWei).toEqual(200n)

        expect(stake.lockedWei).toEqual(100n)

        expect(stake.joinTimestamp).toEqual(1)
    })

    it('parses stream', async () => {
        const { stream: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, stream: null }, options),
        ).resolves.toMatchObject({
            streamId: undefined,
        })

        await expect(
            parseSponsorship({ ...rest, stream: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(parseSponsorship({ ...rest, stream: '' }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, stream: 'WHATEVER' }, options),
        ).rejects.toThrow(/failed to parse/i)

        const { streamId } = await parseSponsorship(
            {
                ...rest,
                stream: { id: 'STREAM_ID' },
            },
            options,
        )

        expect(streamId).toEqual('STREAM_ID')
    })

    it('parses isRunning', async () => {
        const { isRunning: _, ...rest } = valid

        await expect(parseSponsorship({ ...rest }, options)).rejects.toThrow(
            /failed to parse/i,
        )

        await expect(
            parseSponsorship({ ...rest, isRunning: '' }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, isRunning: null }, options),
        ).rejects.toThrow(/failed to parse/i)

        await expect(
            parseSponsorship({ ...rest, isRunning: undefined }, options),
        ).rejects.toThrow(/failed to parse/i)
    })

    describe('timeCorrectedRemainingBalance calculation', () => {
        it('correctly substracts the payout from the remaining balance', async () => {
            expect(
                await parseSponsorship(
                    {
                        ...valid,
                        remainingWeiUpdateTimestamp: `${now - 7}`,
                        totalPayoutWeiPerSec: '1',
                        remainingWei: '1337',
                        isRunning: true,
                    },
                    options,
                ),
            ).toMatchObject({
                timeCorrectedRemainingBalance: 1330n,
            })
        })

        it('gives the entire remaining balance if the sponsorship is not running', async () => {
            expect(
                await parseSponsorship(
                    {
                        ...valid,
                        remainingWeiUpdateTimestamp: `${now - 7}`,
                        totalPayoutWeiPerSec: '1',
                        remainingWei: '1337',
                        isRunning: false,
                    },
                    options,
                ),
            ).toMatchObject({
                timeCorrectedRemainingBalance: 1337n,
            })
        })

        it('goes down to zero and not a dime further', async () => {
            expect(
                await parseSponsorship(
                    {
                        ...valid,
                        remainingWeiUpdateTimestamp: `${now - 2000}`,
                        totalPayoutWeiPerSec: '1',
                        remainingWei: '1337',
                        isRunning: true,
                    },
                    options,
                ),
            ).toMatchObject({
                timeCorrectedRemainingBalance: 0n,
            })
        })
    })
})
