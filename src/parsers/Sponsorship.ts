import { z } from 'zod'
import { ParseError } from '~/errors'
import { OperatorMetadata } from '~/parsers/OperatorMetadata'
import { Parsable } from '~/parsers/Parsable'
import { toBigInt } from '~/utils/bn'

const RawSponsorship = z.object({
    cumulativeSponsoring: z.unknown(),
    id: z.string(),
    isRunning: z.unknown(),
    minOperators: z.unknown(),
    maxOperators: z.unknown(),
    minimumStakingPeriodSeconds: z.unknown(),
    operatorCount: z.unknown(),
    projectedInsolvency: z.unknown(),
    remainingWei: z.unknown(),
    remainingWeiUpdateTimestamp: z.unknown(),
    spotAPY: z.unknown(),
    stream: z.unknown(),
    stakes: z.unknown(),
    totalPayoutWeiPerSec: z.unknown(),
    totalStakedWei: z.unknown(),
})

type RawSponsorship = z.infer<typeof RawSponsorship>

export class Sponsorship extends Parsable<RawSponsorship> {
    static parse(raw: unknown, chainId: number): Sponsorship {
        try {
            return new Sponsorship(raw, chainId)
        } catch (e) {
            if (e instanceof z.ZodError) {
                throw new ParseError(raw, e)
            }

            throw e
        }
    }

    protected preparse() {
        return RawSponsorship.parse(this.raw)
    }

    get cumulativeSponsoring() {
        return this.getValue('cumulativeSponsoring', (raw) => {
            return z
                .union([z.string(), z.number().int().min(0)])
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get id() {
        return this.getValue('id')
    }

    get isRunning() {
        return this.getValue('isRunning', (raw) => {
            return z.boolean().catch(false).parse(raw)
        })
    }

    get minOperators() {
        return this.getValue('minOperators', (raw) => {
            return z.coerce.number().int().min(0).catch(0).parse(raw)
        })
    }

    get maxOperators() {
        return this.getValue('maxOperators', (raw) => {
            return z.coerce
                .number()
                .int()
                .min(0)
                .default(Infinity)
                .catch(Infinity)
                .parse(raw)
        })
    }

    get minimumStakingPeriodSeconds() {
        return this.getValue('minimumStakingPeriodSeconds', (raw) => {
            return z.coerce.number().min(0).catch(0).parse(raw)
        })
    }

    get operatorCount() {
        return this.getValue('operatorCount', (raw) => {
            return z.coerce.number().int().min(0).catch(0).parse(raw)
        })
    }

    get projectedInsolvencyAt() {
        return this.getValue('projectedInsolvency', (raw) => {
            return z
                .union([
                    z.string().transform(Number).pipe(z.number()),
                    z.number(),
                    z.null(),
                ])
                .catch(null)
                .transform((v) => (v === null ? null : new Date(Number(v) * 1000)))
                .parse(raw)
        })
    }

    get remainingBalanceWei() {
        return this.getValue('remainingWei', (raw) => {
            return z
                .union([z.string(), z.number().int().min(0)])
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get remainingBalanceUpdatedAt() {
        return this.getValue('remainingWeiUpdateTimestamp', (raw) => {
            return z
                .union([
                    z.string().transform(Number).pipe(z.number()),
                    z.number(),
                    z.null(),
                ])
                .catch(null)
                .transform((v) => (v === null ? null : new Date(Number(v) * 1000)))
                .parse(raw)
        })
    }

    get spotApy() {
        return this.getValue('spotAPY', (raw) => {
            return z.coerce.number().catch(0).parse(raw)
        })
    }

    get streamId() {
        return this.getValue('stream', (raw) => {
            return z
                .union([
                    z.null(),
                    z.object({
                        id: z.string(),
                    }),
                ])
                .catch(null)
                .parse(raw)?.id
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
                                operator: z.object({
                                    id: z.string(),
                                    metadataJsonString: z.unknown(),
                                }),
                                amountWei: z.string().transform((v) => toBigInt(v)),
                                lockedWei: z.string().transform((v) => toBigInt(v)),
                                joinTimestamp: z.coerce.number(),
                            }),
                        ])
                        .catch(null),
                )
                .catch([])
                .transform((stakes) => {
                    const result: {
                        amountWei: bigint
                        lockedWei: bigint
                        joinedAt: Date
                        operatorId: string
                        metadata: OperatorMetadata
                    }[] = []

                    for (const s of stakes) {
                        if (!s) {
                            continue
                        }

                        const { operator, joinTimestamp, ...rest } = s

                        result.push({
                            ...s,
                            joinedAt: new Date(joinTimestamp * 1000),
                            metadata: OperatorMetadata.parse(
                                operator.metadataJsonString,
                                this.chainId,
                            ),
                            operatorId: operator.id,
                        })
                    }

                    return result
                })
                .parse(raw)
        })
    }

    get payoutPerSecond() {
        return this.getValue('totalPayoutWeiPerSec', (raw) => {
            return z
                .union([z.string(), z.number().int().min(0)])
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    get payoutPerDay() {
        return this.payoutPerSecond * 86400n
    }

    get totalStakedWei() {
        return this.getValue('totalStakedWei', (raw) => {
            return z
                .union([z.string(), z.number().int().min(0)])
                .transform((v) => toBigInt(v || 0))
                .catch(0n)
                .parse(raw)
        })
    }

    timeCorrectedRemainingBalanceWeiAt(timestampInMillis: number) {
        const time = timestampInMillis - (timestampInMillis % 1000)

        if (!this.isRunning) {
            return this.remainingBalanceWei
        }

        const secondsElapsed =
            Math.max(0, time - (this.remainingBalanceUpdatedAt?.getTime() ?? time)) / 1000

        const result =
            this.remainingBalanceWei - toBigInt(secondsElapsed) * this.payoutPerSecond

        return result > 0n ? result : 0n
    }
}
