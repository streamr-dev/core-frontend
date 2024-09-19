import { ZeroAddress } from 'ethers'
import { z } from 'zod'
import { OperatorMetadata } from '~/parsers/OperatorMetadata'
import { Parsable } from '~/parsers/Parsable'
import { BN, toBigInt, toBN, toFloat } from '~/utils/bn'

const RawOperator = z.object({
    contractVersion: z.unknown(),
    controllers: z.unknown(),
    cumulativeOperatorsCutWei: z.unknown(),
    cumulativeProfitsWei: z.unknown(),
    dataTokenBalanceWei: z.unknown(),
    delegations: z.unknown(),
    delegatorCount: z.unknown(),
    exchangeRate: z.unknown(),
    id: z.string(),
    metadataJsonString: z.unknown(),
    nodes: z.unknown(),
    operatorsCutFraction: z.unknown(),
    operatorTokenTotalSupplyWei: z.unknown(),
    owner: z.unknown(),
    queueEntries: z.unknown(),
    slashingEvents: z.unknown(),
    stakes: z.unknown(),
    totalStakeInSponsorshipsWei: z.unknown(),
    valueUpdateBlockNumber: z.unknown(),
    valueUpdateTimestamp: z.unknown(),
    valueWithoutEarnings: z.unknown(),
})

type RawOperator = z.infer<typeof RawOperator>

export class Operator extends Parsable<RawOperator> {
    static parse(raw: unknown, chainId: number): Operator {
        return new Operator(raw, chainId)
    }

    protected preparse() {
        return RawOperator.parse(this.raw)
    }

    get contractVersion() {
        return this.getValue('contractVersion', (raw) => {
            return z.coerce.number().catch(-1).parse(raw)
        })
    }

    get controllers() {
        return this.getValue('controllers', (raw) => {
            return z
                .array(z.string().catch(''))
                .catch([])
                .transform((value) => {
                    const result: {
                        address: string
                        enabled: boolean
                        persisted: boolean
                    }[] = []

                    for (const addr of value) {
                        if (!addr) {
                            result.push({
                                address: addr.toLowerCase(),
                                enabled: true,
                                persisted: true,
                            })
                        }
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get cumulativeOperatorsCutWei() {
        return this.getValue('cumulativeOperatorsCutWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get cumulativeProfitsWei() {
        return this.getValue('cumulativeProfitsWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get dataTokenBalanceWei() {
        return this.getValue('dataTokenBalanceWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get delegations() {
        return this.getValue('delegations', (raw) => {
            return z
                .array(
                    z
                        .union([
                            z.null(),
                            z.object({
                                id: z.string(),
                                delegator: z.object({
                                    id: z.string(),
                                }),
                                operatorTokenBalanceWei: z
                                    .string()
                                    .transform((v) => toBigInt(v || 0)),
                                latestDelegationTimestamp: z.coerce.number(),
                                earliestUndelegationTimestamp: z.coerce.number(),
                            }),
                        ])
                        .catch(null),
                )
                .catch([])
                .transform((delegations) => {
                    const result: {
                        amount: bigint
                        delegator: string
                        earliestUndelegationTimestamp: number
                        id: string
                        latestDelegationTimestamp: number
                        operatorTokenBalanceWei: bigint
                    }[] = []

                    for (const d of delegations) {
                        if (d) {
                            result.push({
                                ...d,
                                delegator: d.delegator.id,
                                amount: toBigInt(
                                    toBN(d.operatorTokenBalanceWei).multipliedBy(
                                        this.exchangeRate,
                                    ),
                                ),
                            })
                        }
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get delegatorCount() {
        return this.getValue('delegatorCount', (raw) => {
            return z.number().catch(0).parse(raw)
        })
    }

    get exchangeRate() {
        return this.getValue('exchangeRate', (raw) => {
            return z
                .string()
                .transform((v) => toBN(v || 0))
                .catch(toBN(0))
                .parse(raw)
        })
    }

    get id() {
        return this.getValue('id')
    }

    get metadata() {
        return this.getValue('metadataJsonString', (raw) => {
            return new OperatorMetadata(raw, this.chainId)
        })
    }

    get nodes() {
        return this.getValue('nodes', (raw) => {
            return z
                .array(z.string().catch(''))
                .catch([])
                .transform((value) => {
                    const result: {
                        address: string
                        enabled: boolean
                        persisted: boolean
                    }[] = []

                    for (const addr of value) {
                        if (!addr) {
                            result.push({
                                address: addr.toLowerCase(),
                                enabled: true,
                                persisted: true,
                            })
                        }
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get operatorsCut() {
        return this.getValue('operatorsCutFraction', (raw) => {
            return z
                .string()
                .transform((v) =>
                    toFloat(toBigInt(v || 0), 18n)
                        .multipliedBy(100)
                        .toNumber(),
                )
                .catch(0)
                .parse(raw)
        })
    }

    get operatorTokenTotalSupplyWei() {
        return this.getValue('operatorTokenTotalSupplyWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get owner() {
        return this.getValue('owner', (raw) => {
            return z.string().catch(ZeroAddress).parse(raw)
        })
    }

    get queueEntries() {
        return this.getValue('queueEntries', (raw) => {
            return z
                .array(
                    z
                        .union([
                            z.null(),
                            z.object({
                                amount: z.string().transform((v) => toBigInt(v || 0)),
                                date: z.coerce.number(),
                                delegator: z.object({ id: z.string() }),
                                id: z.string(),
                            }),
                        ])
                        .catch(null),
                )
                .catch([])
                .transform((entries) => {
                    const result: {
                        amount: bigint
                        date: number
                        delegator: string
                        id: string
                    }[] = []

                    for (const e of entries) {
                        if (e) {
                            result.push({
                                ...e,
                                delegator: e.delegator.id,
                            })
                        }
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get slashingEvents() {
        return this.getValue('slashingEvents', (raw) => {
            return z
                .array(
                    z
                        .union([
                            z.null(),
                            z.object({
                                amount: z.string().transform((v) => toBigInt(v || 0)),
                                date: z.coerce.number(),
                                sponsorship: z.object({
                                    id: z.string(),
                                    stream: z.object({
                                        id: z.string(),
                                    }),
                                }),
                            }),
                        ])
                        .catch(null),
                )
                .catch([])
                .transform((events) => {
                    const result: {
                        amount: bigint
                        date: number
                        sponsorshipId: string
                        streamId: string
                    }[] = []

                    for (const e of events) {
                        if (e) {
                            const { id: sponsorshipId, stream } = e.sponsorship

                            result.push({
                                ...e,
                                sponsorshipId,
                                streamId: stream.id,
                            })
                        }
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get stakes() {
        return this.getValue('stakes', (raw) => {
            return z
                .array(
                    z
                        .union([
                            z.null(),
                            z.object({
                                amountWei: z.string().transform((v) => toBigInt(v)),
                                earningsWei: z.string().transform((v) => toBigInt(v)),
                                joinTimestamp: z.coerce.number(),
                                operator: z.object({
                                    id: z.string(),
                                }),
                                sponsorship: z.object({
                                    id: z.string(),
                                    isRunning: z.boolean(),
                                    remainingWei: z
                                        .string()
                                        .transform((v) => toBigInt(v)),
                                    minimumStakingPeriodSeconds: z.coerce.number(),
                                    spotAPY: z.string().transform(toBN),
                                    projectedInsolvency: z
                                        .union([z.string(), z.null()])
                                        .transform((v) => (v == null ? null : Number(v))),
                                    stream: z.union([
                                        z.object({
                                            id: z.string(),
                                        }),
                                        z.null(),
                                    ]),
                                }),
                            }),
                        ])
                        .catch(null),
                )
                .catch([])
                .transform((stakes) => {
                    const result: {
                        amountWei: bigint
                        earningsWei: bigint
                        isSponsorshipPaying: boolean
                        joinedAt: Date
                        minimumStakingPeriodSeconds: number
                        operatorId: string
                        projectedInsolvencyAt: Date | null
                        remainingWei: bigint
                        sponsorshipId: string
                        spotAPY: BN
                        streamId: string | undefined
                    }[] = []

                    for (const s of stakes) {
                        if (!s) {
                            continue
                        }

                        const {
                            amountWei,
                            earningsWei,
                            joinTimestamp,
                            operator,
                            sponsorship,
                        } = s

                        const {
                            id: sponsorshipId,
                            projectedInsolvency,
                            remainingWei,
                            spotAPY,
                            stream,
                        } = sponsorship

                        result.push({
                            amountWei,
                            earningsWei,
                            isSponsorshipPaying:
                                sponsorship.isRunning && sponsorship.remainingWei > 0n,
                            joinedAt: new Date(joinTimestamp * 1000),
                            minimumStakingPeriodSeconds:
                                sponsorship.minimumStakingPeriodSeconds,
                            operatorId: operator.id,
                            projectedInsolvencyAt:
                                projectedInsolvency != null
                                    ? new Date(projectedInsolvency * 1000)
                                    : null,
                            remainingWei,
                            sponsorshipId,
                            spotAPY,
                            streamId: stream?.id,
                        })
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get totalStakeInSponsorshipsWei() {
        return this.getValue('totalStakeInSponsorshipsWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get valueUpdateBlockNumber() {
        return this.getValue('valueUpdateBlockNumber', (raw) => {
            return z.coerce.number().optional().catch(undefined).parse(raw)
        })
    }

    get valueUpdateTimestamp() {
        return this.getValue('valueUpdateTimestamp', (raw) => {
            return z.coerce.number().optional().catch(undefined).parse(raw)
        })
    }

    get valueWithoutEarnings() {
        return this.getValue('valueWithoutEarnings', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }
}
