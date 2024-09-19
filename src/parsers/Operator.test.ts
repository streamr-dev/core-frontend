import { ZeroAddress } from 'ethers'
import { Operator } from './Operator'

function parse(raw: unknown) {
    return Operator.parse(raw, 137)
}

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

describe('parseOperator', () => {
    it('parses valid payload', () => {
        const result = parse(valid)

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
                    joinedAt: expect.anything(),
                    operatorId: 'OPERATOR_ID',
                    sponsorshipId: 'SPONSORSHIP_ID',
                    isSponsorshipPaying: true,
                    remainingWei: 120n,
                    minimumStakingPeriodSeconds: 3600,
                    spotAPY: expect.anything(),
                    projectedInsolvencyAt: expect.anything(),
                    streamId: 'STREAM_ID',
                }),
            ]),
        )

        expect(result.stakes?.[0]?.projectedInsolvencyAt?.getTime()).toEqual(
            (now + 3 * 24 * 60 * 60) * 1000,
        )

        expect(result.stakes?.[0]?.joinedAt?.getTime()).toEqual(
            (now - 5 * 24 * 60 * 60) * 1000,
        )

        expect(result.stakes?.[0]?.spotAPY?.toString()).toEqual('0.39')

        expect(result.totalStakeInSponsorshipsWei).toEqual(10000n)

        expect(result.valueUpdateBlockNumber).toEqual(1337)

        expect(result.valueUpdateTimestamp).toEqual(now - 5 * 60)

        expect(result.valueWithoutEarnings).toEqual(1123n)
    })

    it('parses cumulativeOperatorsCutWei', () => {
        const { cumulativeOperatorsCutWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            cumulativeOperatorsCutWei: 0n,
        })

        expect(parse({ ...rest, cumulativeOperatorsCutWei: '' })).toMatchObject({
            cumulativeOperatorsCutWei: 0n,
        })

        expect(parse({ ...rest, cumulativeOperatorsCutWei: 12 })).toMatchObject({
            cumulativeOperatorsCutWei: 12n,
        })

        expect(parse({ ...rest, cumulativeOperatorsCutWei: undefined })).toMatchObject({
            cumulativeOperatorsCutWei: 0n,
        })

        expect(parse({ ...rest, cumulativeOperatorsCutWei: null })).toMatchObject({
            cumulativeOperatorsCutWei: 0n,
        })
    })

    it('parses cumulativeProfitsWei', () => {
        const { cumulativeProfitsWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            cumulativeProfitsWei: 0n,
        })

        expect(parse({ ...rest, cumulativeProfitsWei: '' })).toMatchObject({
            cumulativeProfitsWei: 0n,
        })

        expect(parse({ ...rest, cumulativeProfitsWei: 12 })).toMatchObject({
            cumulativeProfitsWei: 12n,
        })

        expect(parse({ ...rest, cumulativeProfitsWei: undefined })).toMatchObject({
            cumulativeProfitsWei: 0n,
        })

        expect(parse({ ...rest, cumulativeProfitsWei: null })).toMatchObject({
            cumulativeProfitsWei: 0n,
        })
    })

    it('parses dataTokenBalanceWei', () => {
        const { dataTokenBalanceWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            dataTokenBalanceWei: 0n,
        })

        expect(parse({ ...rest, dataTokenBalanceWei: '' })).toMatchObject({
            dataTokenBalanceWei: 0n,
        })

        expect(parse({ ...rest, dataTokenBalanceWei: 12 })).toMatchObject({
            dataTokenBalanceWei: 12n,
        })

        expect(parse({ ...rest, dataTokenBalanceWei: undefined })).toMatchObject({
            dataTokenBalanceWei: 0n,
        })

        expect(parse({ ...rest, dataTokenBalanceWei: null })).toMatchObject({
            dataTokenBalanceWei: 0n,
        })
    })

    it('parses delegatorCount', () => {
        const { delegatorCount: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            delegatorCount: 0,
        })

        expect(parse({ ...rest, delegatorCount: '' })).toMatchObject({
            delegatorCount: 0,
        })

        expect(parse({ ...rest, delegatorCount: null })).toMatchObject({
            delegatorCount: 0,
        })

        expect(parse({ ...rest, delegatorCount: undefined })).toMatchObject({
            delegatorCount: 0,
        })

        expect(parse({ ...rest, delegatorCount: '12' })).toMatchObject({
            delegatorCount: 0,
        })
    })

    it('parses delegations', () => {
        const { delegations: _, ...rest } = valid

        expect(parse({ ...rest })).toEqual(expect.arrayContaining([]))

        expect(parse({ ...rest, delegations: null })).toEqual(expect.arrayContaining([]))

        expect(parse({ ...rest, delegations: undefined })).toEqual(
            expect.arrayContaining([]),
        )

        expect(parse({ ...rest, delegations: [] }).delegations).toEqual(
            expect.arrayContaining([]),
        )
    })

    it('parses exchangeRate', () => {
        const { exchangeRate: _, ...rest } = valid

        expect(parse({ ...rest }).exchangeRate.toNumber()).toEqual(0)

        expect(parse({ ...rest, exchangeRate: 0.99 }).exchangeRate.toNumber()).toEqual(
            0.99,
        )

        expect(parse({ ...rest, exchangeRate: '' }).exchangeRate.toNumber()).toEqual(0)

        expect(parse({ ...rest, exchangeRate: null }).exchangeRate.toNumber()).toEqual(0)

        expect(
            parse({ ...rest, exchangeRate: undefined }).exchangeRate.toNumber(),
        ).toEqual(0)
    })

    it('parses id', () => {
        const { id: _, ...rest } = valid

        expect(() => parse({ ...rest })).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: null })).toThrow(/failed to parse/i)

        expect(() => parse({ ...rest, id: undefined })).toThrow(/failed to parse/i)
    })

    it('parses metadataJsonString', () => {
        const { metadataJsonString: _, ...rest } = valid

        expect(parse({ ...rest })).toEqual(
            expect.objectContaining({
                metadata: expect.objectContaining({ name: '' }),
            }),
        )

        expect(parse({ ...rest, metadataJsonString: null })).toEqual(
            expect.objectContaining({
                metadata: expect.objectContaining({ name: '' }),
            }),
        )

        expect(parse({ ...rest, metadataJsonString: undefined })).toEqual(
            expect.objectContaining({
                metadata: expect.objectContaining({ name: '' }),
            }),
        )
    })

    it('parses nodes', () => {
        const { nodes: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            nodes: [],
        })

        expect(parse({ ...rest, nodes: null })).toMatchObject({
            nodes: [],
        })

        expect(parse({ ...rest, nodes: undefined })).toMatchObject({
            nodes: [],
        })

        expect(parse({ ...rest, nodes: [null, '0xABC', true, undefined] })).toEqual(
            expect.objectContaining({
                nodes: expect.arrayContaining([
                    expect.objectContaining({
                        address: '0xabc',
                        enabled: true,
                        persisted: true,
                    }),
                ]),
            }),
        )
    })

    it('parses controllers', () => {
        const { controllers: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            controllers: [],
        })

        expect(parse({ ...rest, controllers: null })).toMatchObject({
            controllers: [],
        })

        expect(parse({ ...rest, controllers: undefined })).toMatchObject({
            controllers: [],
        })

        expect(parse({ ...rest, controllers: [null, '0xABC', true, undefined] })).toEqual(
            expect.objectContaining({
                controllers: expect.arrayContaining([
                    expect.objectContaining({
                        address: '0xabc',
                        enabled: true,
                        persisted: true,
                    }),
                ]),
            }),
        )
    })

    it('parses operatorsCutFraction', () => {
        const { operatorsCutFraction: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            operatorsCut: 0,
        })

        expect(parse({ ...rest, operatorsCutFraction: 0.05 })).toMatchObject({
            operatorsCut: 0,
        })

        expect(parse({ ...rest, operatorsCutFraction: null })).toMatchObject({
            operatorsCut: 0,
        })

        expect(parse({ ...rest, operatorsCutFraction: undefined })).toMatchObject({
            operatorsCut: 0,
        })
    })

    it('parses owner', () => {
        const { owner: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            owner: ZeroAddress,
        })

        expect(parse({ ...rest, owner: null })).toMatchObject({
            owner: ZeroAddress,
        })

        expect(parse({ ...rest, owner: undefined })).toMatchObject({
            owner: ZeroAddress,
        })
    })

    it('parses contractVersion', () => {
        const { contractVersion: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            contractVersion: -1,
        })

        expect(parse({ ...rest, contractVersion: 'abc' })).toMatchObject({
            contractVersion: -1,
        })

        expect(parse({ ...rest, contractVersion: null })).toMatchObject({
            contractVersion: -1,
        })

        expect(parse({ ...rest, contractVersion: undefined })).toMatchObject({
            contractVersion: -1,
        })
    })

    it('parses operatorTokenTotalSupplyWei', () => {
        const { operatorTokenTotalSupplyWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            operatorTokenTotalSupplyWei: 0n,
        })

        expect(parse({ ...rest, operatorTokenTotalSupplyWei: '' })).toMatchObject({
            operatorTokenTotalSupplyWei: 0n,
        })

        expect(parse({ ...rest, operatorTokenTotalSupplyWei: 12 })).toMatchObject({
            operatorTokenTotalSupplyWei: 12n,
        })

        expect(parse({ ...rest, operatorTokenTotalSupplyWei: undefined })).toMatchObject({
            operatorTokenTotalSupplyWei: 0n,
        })

        expect(parse({ ...rest, operatorTokenTotalSupplyWei: null })).toMatchObject({
            operatorTokenTotalSupplyWei: 0n,
        })
    })

    it('parses valueWithoutEarnings', () => {
        const { valueWithoutEarnings: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            valueWithoutEarnings: 0n,
        })

        expect(parse({ ...rest, valueWithoutEarnings: '' })).toMatchObject({
            valueWithoutEarnings: 0n,
        })

        expect(parse({ ...rest, valueWithoutEarnings: 12 })).toMatchObject({
            valueWithoutEarnings: 12n,
        })

        expect(parse({ ...rest, valueWithoutEarnings: undefined })).toMatchObject({
            valueWithoutEarnings: 0n,
        })

        expect(parse({ ...rest, valueWithoutEarnings: null })).toMatchObject({
            valueWithoutEarnings: 0n,
        })
    })

    it('parses valueUpdateBlockNumber', () => {
        const { valueUpdateBlockNumber: _, ...rest } = valid

        expect(parse({ ...rest }).valueUpdateBlockNumber).toEqual(undefined)

        expect(parse({ ...rest, valueUpdateBlockNumber: '' })).toMatchObject({
            valueUpdateBlockNumber: 0,
        })

        expect(parse({ ...rest, valueUpdateBlockNumber: false })).toMatchObject({
            valueUpdateBlockNumber: 0,
        })

        expect(parse({ ...rest, valueUpdateBlockNumber: true })).toMatchObject({
            valueUpdateBlockNumber: 1,
        })

        expect(parse({ ...rest, valueUpdateBlockNumber: null })).toMatchObject({
            valueUpdateBlockNumber: 0,
        })
    })

    it('parses valueUpdateTimestamp', () => {
        const { valueUpdateTimestamp: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            valueUpdateTimestamp: undefined,
        })

        expect(parse({ ...rest, valueUpdateTimestamp: '' })).toMatchObject({
            valueUpdateTimestamp: 0,
        })

        expect(parse({ ...rest, valueUpdateTimestamp: false })).toMatchObject({
            valueUpdateTimestamp: 0,
        })

        expect(parse({ ...rest, valueUpdateTimestamp: true })).toMatchObject({
            valueUpdateTimestamp: 1,
        })

        expect(parse({ ...rest, valueUpdateTimestamp: null })).toMatchObject({
            valueUpdateTimestamp: 0,
        })
    })

    it('parses queueEntries', () => {
        const { queueEntries: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({ queueEntries: [] })

        expect(parse({ ...rest, queueEntries: null })).toMatchObject({
            queueEntries: [],
        })

        expect(parse({ ...rest, queueEntries: undefined })).toMatchObject({
            queueEntries: [],
        })
    })

    it('parses slashingEvents', () => {
        const { slashingEvents: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({ slashingEvents: [] })

        expect(parse({ ...rest, slashingEvents: null })).toMatchObject({
            slashingEvents: [],
        })

        expect(parse({ ...rest, slashingEvents: undefined })).toMatchObject({
            slashingEvents: [],
        })
    })

    it('parses stakes', () => {
        const { stakes: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: null })).toMatchObject({
            stakes: [],
        })

        expect(parse({ ...rest, stakes: undefined })).toMatchObject({
            stakes: [],
        })
    })

    it('parses totalStakeInSponsorshipsWei', () => {
        const { totalStakeInSponsorshipsWei: _, ...rest } = valid

        expect(parse({ ...rest })).toMatchObject({
            totalStakeInSponsorshipsWei: 0n,
        })

        expect(parse({ ...rest, totalStakeInSponsorshipsWei: '' })).toMatchObject({
            totalStakeInSponsorshipsWei: 0n,
        })

        expect(parse({ ...rest, totalStakeInSponsorshipsWei: 12 })).toMatchObject({
            totalStakeInSponsorshipsWei: 12n,
        })

        expect(parse({ ...rest, totalStakeInSponsorshipsWei: undefined })).toMatchObject({
            totalStakeInSponsorshipsWei: 0n,
        })

        expect(parse({ ...rest, totalStakeInSponsorshipsWei: null })).toMatchObject({
            totalStakeInSponsorshipsWei: 0n,
        })
    })
})
