import { parseOperator as parse } from './OperatorParser'

const now = Math.floor(Date.now() / 1000)

const valid = {
    cumulativeOperatorsCutWei: '1234',
    cumulativeProfitsWei: '1000001',
    dataTokenBalanceWei: '5000',
    delegatorCount: 7,
    delegations: [
        {
            id: '0x777',
            delegator: {
                id: '0x665',
            },
            operatorTokenBalanceWei: '1000',
            latestDelegationTimestamp: `${now}`,
            earliestUndelegationTimestamp: `${now + 120 * 60}`, // in 2h
        },
    ],
    exchangeRate: '0.97',
    id: 'OPERATOR_ID',
    metadataJsonString: '{}',
    nodes: ['0x00001', '0x00002'],
    controllers: ['0x11111', '0x11112'],
    operatorsCutFraction: '50000000000000000', // 5%
    owner: '0x11111',
    contractVersion: 3,
    operatorTokenTotalSupplyWei: '5000',
    valueWithoutEarnings: '1123',
    valueUpdateBlockNumber: 1337,
    valueUpdateTimestamp: `${now - 5 * 60}`, // 5 minutes ago
    queueEntries: [
        {
            amount: '123',
            date: `${now - 60 * 60}`, // an hour ago
            delegator: {
                id: '0x33333',
            },
            id: 'QUEUE_ENTRY_ID',
        },
    ],
    slashingEvents: [
        {
            amount: '5',
            date: `${now - 3 * 60 * 60}`, // 3h ago
            sponsorship: {
                id: 'SPONSORSHIP_ID',
                stream: {
                    id: 'STREAM_ID',
                },
            },
        },
    ],
    stakes: [
        {
            amountWei: '100',
            earningsWei: '10',
            joinTimestamp: `${now - 5 * 24 * 60 * 60}`, // 5d ago
            operator: {
                id: 'OPERATOR_ID',
            },
            sponsorship: {
                id: 'SPONSORSHIP_ID',
                isRunning: true,
                remainingWei: '120',
                minimumStakingPeriodSeconds: 60 * 60,
                spotAPY: '0.39',
                projectedInsolvency: `${now + 3 * 24 * 60 * 60}`, // in 2d
                stream: {
                    id: 'STREAM_ID',
                },
            },
        },
    ],
    totalStakeInSponsorshipsWei: '10000',
}

const options = {
    chainId: 137,
}

describe('parseOperator', () => {
    it('parses valid payload', () => {
        const result = parse(valid, options)

        expect(result.contractVersion).toEqual(3)

        expect(result.controllers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    address: '0x11111',
                    enabled: true,
                    persisted: true,
                }),
                expect.objectContaining({
                    address: '0x11112',
                    enabled: true,
                    persisted: true,
                }),
            ]),
        )

        expect(result.cumulativeOperatorsCutWei).toEqual(1234n)

        expect(result.cumulativeProfitsWei).toEqual(1000001n)

        expect(result.dataTokenBalanceWei).toEqual(5000n)

        expect(result.delegations).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    delegator: '0x665',
                    earliestUndelegationTimestamp: now + 120 * 60,
                    id: '0x777',
                    latestDelegationTimestamp: now,
                    operatorTokenBalanceWei: 1000n,
                }),
            ]),
        )

        expect(result.delegatorCount).toEqual(7)

        expect(result.exchangeRate?.toString()).toEqual('0.97')

        expect(result.id).toEqual('OPERATOR_ID')

        expect(result.metadata).toEqual(expect.objectContaining({ name: '' }))

        expect(result.nodes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    address: '0x00001',
                    enabled: true,
                    persisted: true,
                }),
                expect.objectContaining({
                    address: '0x00002',
                    enabled: true,
                    persisted: true,
                }),
            ]),
        )

        expect(result.operatorsCut).toEqual(5)

        expect(result.operatorTokenTotalSupplyWei).toEqual(5000n)

        expect(result.owner).toEqual('0x11111')

        expect(result.queueEntries).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    amount: 123n,
                    date: now - 60 * 60,
                    delegator: '0x33333',
                    id: 'QUEUE_ENTRY_ID',
                }),
            ]),
        )

        expect(result.slashingEvents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    amount: 5n,
                    date: now - 3 * 60 * 60,
                    sponsorshipId: 'SPONSORSHIP_ID',
                    streamId: 'STREAM_ID',
                }),
            ]),
        )

        expect(result.stakes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    amountWei: 100n,
                    earningsWei: 10n,
                    joinTimestamp: now - 5 * 24 * 60 * 60,
                    operatorId: 'OPERATOR_ID',
                    sponsorshipId: 'SPONSORSHIP_ID',
                    isSponsorshipPaying: true,
                    remainingWei: 120n,
                    minimumStakingPeriodSeconds: 3600,
                    spotAPY: expect.anything(),
                    projectedInsolvencyAt: now + 3 * 24 * 60 * 60,
                    streamId: 'STREAM_ID',
                }),
            ]),
        )

        expect(result.stakes?.[0].spotAPY.toString()).toEqual('0.39')

        expect(result.totalStakeInSponsorshipsWei).toEqual(10000n)

        expect(result.valueUpdateBlockNumber).toEqual(1337)

        expect(result.valueUpdateTimestamp).toEqual(now - 5 * 60)

        expect(result.valueWithoutEarnings).toEqual(1123n)
    })

    it('parses cumulativeOperatorsCutWei', () => {
        const { cumulativeOperatorsCutWei: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, cumulativeOperatorsCutWei: '' }, options)
                .cumulativeOperatorsCutWei,
        ).toEqual(0n)

        expect(() => parse({ ...rest, cumulativeOperatorsCutWei: 12 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() =>
            parse({ ...rest, cumulativeOperatorsCutWei: undefined }, options),
        ).toThrow(/failed to parse/i)

        expect(() =>
            parse({ ...rest, cumulativeOperatorsCutWei: null }, options),
        ).toThrow(/failed to parse/i)
    })

    it('parses cumulativeProfitsWei', () => {
        const { cumulativeProfitsWei: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, cumulativeProfitsWei: '' }, options).cumulativeProfitsWei,
        ).toEqual(0n)

        expect(() => parse({ ...rest, cumulativeProfitsWei: 12 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() =>
            parse({ ...rest, cumulativeProfitsWei: undefined }, options),
        ).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, cumulativeProfitsWei: null }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses dataTokenBalanceWei', () => {
        const { dataTokenBalanceWei: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, dataTokenBalanceWei: '' }, options).dataTokenBalanceWei,
        ).toEqual(0n)

        expect(() => parse({ ...rest, dataTokenBalanceWei: 12 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, dataTokenBalanceWei: undefined }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, dataTokenBalanceWei: null }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses delegatorCount', () => {
        const { delegatorCount: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, delegatorCount: '' }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, delegatorCount: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, delegatorCount: undefined }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, delegatorCount: '12' }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses delegations', () => {
        const { delegations: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, delegations: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, delegations: undefined }, options)).toThrow(
            /failed to parse/i,
        )

        expect(parse({ ...rest, delegations: [] }, options).delegations).toEqual(
            expect.arrayContaining([]),
        )
    })

    it('parses exchangeRate', () => {
        const { exchangeRate: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, exchangeRate: 0.99 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(
            parse({ ...rest, exchangeRate: '' }, options).exchangeRate?.toString(),
        ).toEqual('0')

        expect(() => parse({ ...rest, exchangeRate: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, exchangeRate: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses id', () => {
        const { id: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: null }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses metadataJsonString', () => {
        const { metadataJsonString: _, ...rest } = valid

        expect(parse({ ...rest }, options).metadata).toEqual(
            expect.objectContaining({ name: '' }),
        )

        expect(
            parse({ ...rest, metadataJsonString: undefined }, options).metadata,
        ).toEqual(expect.objectContaining({ name: '' }))

        expect(() => parse({ ...rest, metadataJsonString: null }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses nodes', () => {
        const { nodes: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, nodes: null }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, nodes: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses controllers', () => {
        const { controllers: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, controllers: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, controllers: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses operatorsCutFraction', () => {
        const { operatorsCutFraction: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, operatorsCutFraction: 0.05 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, operatorsCutFraction: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() =>
            parse({ ...rest, operatorsCutFraction: undefined }, options),
        ).toThrow(/failed to parse/i)
    })

    it('parses owner', () => {
        const { owner: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, owner: null }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, owner: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses contractVersion', () => {
        const { contractVersion: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, contractVersion: 'abc' }, options)).toThrow(
            /failed to parse/i,
        )

        expect(
            parse({ ...rest, contractVersion: null }, options).contractVersion,
        ).toEqual(0)

        expect(() => parse({ ...rest, contractVersion: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses operatorTokenTotalSupplyWei', () => {
        const { operatorTokenTotalSupplyWei: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, operatorTokenTotalSupplyWei: '' }, options)
                .operatorTokenTotalSupplyWei,
        ).toEqual(0n)

        expect(() =>
            parse({ ...rest, operatorTokenTotalSupplyWei: 12 }, options),
        ).toThrow(/failed to parse/i)

        expect(() =>
            parse({ ...rest, operatorTokenTotalSupplyWei: undefined }, options),
        ).toThrow(/failed to parse/i)

        expect(() =>
            parse({ ...rest, operatorTokenTotalSupplyWei: null }, options),
        ).toThrow(/failed to parse/i)
    })

    it('parses valueWithoutEarnings', () => {
        const { valueWithoutEarnings: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, valueWithoutEarnings: '' }, options).valueWithoutEarnings,
        ).toEqual(0n)

        expect(() => parse({ ...rest, valueWithoutEarnings: 12 }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() =>
            parse({ ...rest, valueWithoutEarnings: undefined }, options),
        ).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, valueWithoutEarnings: null }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses valueUpdateBlockNumber', () => {
        const { valueUpdateBlockNumber: _, ...rest } = valid

        expect(parse({ ...rest }, options).valueUpdateBlockNumber).toEqual(undefined)

        expect(
            parse({ ...rest, valueUpdateBlockNumber: '' }, options)
                .valueUpdateBlockNumber,
        ).toEqual(0)

        expect(
            parse({ ...rest, valueUpdateBlockNumber: false }, options)
                .valueUpdateBlockNumber,
        ).toEqual(0)

        expect(
            parse({ ...rest, valueUpdateBlockNumber: true }, options)
                .valueUpdateBlockNumber,
        ).toEqual(1)

        expect(
            parse({ ...rest, valueUpdateBlockNumber: null }, options)
                .valueUpdateBlockNumber,
        ).toEqual(0)
    })

    it('parses valueUpdateTimestamp', () => {
        const { valueUpdateTimestamp: _, ...rest } = valid

        expect(parse({ ...rest }, options).valueUpdateTimestamp).toEqual(undefined)

        expect(
            parse({ ...rest, valueUpdateTimestamp: '' }, options).valueUpdateTimestamp,
        ).toEqual(0)

        expect(
            parse({ ...rest, valueUpdateTimestamp: false }, options).valueUpdateTimestamp,
        ).toEqual(0)

        expect(
            parse({ ...rest, valueUpdateTimestamp: true }, options).valueUpdateTimestamp,
        ).toEqual(1)

        expect(
            parse({ ...rest, valueUpdateTimestamp: null }, options).valueUpdateTimestamp,
        ).toEqual(0)
    })

    it('parses queueEntries', () => {
        const { queueEntries: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, queueEntries: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, queueEntries: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses slashingEvents', () => {
        const { slashingEvents: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, slashingEvents: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, slashingEvents: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses stakes', () => {
        const { stakes: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, stakes: null }, options)).toThrow(
            /failed to parse/i,
        )

        expect(() => parse({ ...rest, stakes: undefined }, options)).toThrow(
            /failed to parse/i,
        )
    })

    it('parses totalStakeInSponsorshipsWei', () => {
        const { totalStakeInSponsorshipsWei: _, ...rest } = valid

        expect(() => parse({ ...rest }, options)).toThrow(/failed to parse/i)

        expect(
            parse({ ...rest, totalStakeInSponsorshipsWei: '' }, options)
                .totalStakeInSponsorshipsWei,
        ).toEqual(0n)

        expect(() =>
            parse({ ...rest, totalStakeInSponsorshipsWei: 12 }, options),
        ).toThrow(/failed to parse/i)

        expect(() =>
            parse({ ...rest, totalStakeInSponsorshipsWei: undefined }, options),
        ).toThrow(/failed to parse/i)

        expect(() =>
            parse({ ...rest, totalStakeInSponsorshipsWei: null }, options),
        ).toThrow(/failed to parse/i)
    })
})
