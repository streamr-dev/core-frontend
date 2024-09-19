import { z } from 'zod'
import { Parsable } from '~/parsers/Parsable'
import { toBigInt } from '~/utils/bn'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from './OperatorMetadataParser'

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
    protected preparse() {
        return RawSponsorship.parse(this.raw)
    }

    cumulativeSponsoring() {
        return this.getValue('cumulativeSponsoring', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v))
                .catch(() => 0n)
                .parse(raw)
        })
    }

    id() {
        return this.getValue('id')
    }

    isRunning() {
        return this.getValue('isRunning', (raw) => {
            return z
                .boolean()
                .catch(() => false)
                .parse(raw)
        })
    }

    minOperators() {
        return this.getValue('minOperators', (raw) => {
            return z
                .number()
                .int()
                .min(0)
                .catch(() => 0)
                .parse(raw)
        })
    }

    maxOperators() {
        return this.getValue('maxOperators', (raw) => {
            return z
                .number()
                .int()
                .min(0)
                .default(Infinity)
                .catch(() => Infinity)
                .parse(raw)
        })
    }

    minimumStakingPeriodSeconds() {
        return this.getValue('minimumStakingPeriodSeconds', (raw) => {
            return z.coerce
                .number()
                .catch(() => 0)
                .parse(raw)
        })
    }

    operatorCount() {
        return this.getValue('operatorCount', (raw) => {
            return z
                .number()
                .int()
                .min(0)
                .catch(() => 0)
                .parse(raw)
        })
    }

    projectedInsolvencyAt() {
        return this.getValue('projectedInsolvency', (raw) => {
            return z
                .union([z.string(), z.null()])
                .catch(() => null)
                .transform((v) => (v === null ? null : new Date(Number(v) * 1000)))
                .parse(raw)
        })
    }

    remainingBalanceWei() {
        return this.getValue('remainingWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v))
                .catch(() => 0n)
                .parse(raw)
        })
    }

    remainingBalanceUpdatedAt() {
        return this.getValue('remainingWeiUpdateTimestamp', (raw) => {
            return z
                .union([z.string(), z.null()])
                .catch(() => null)
                .transform((v) => (v === null ? null : new Date(Number(v) * 1000)))
                .parse(raw)
        })
    }

    spotApy() {
        return this.getValue('spotAPY', (raw) => {
            return z.coerce
                .number()
                .catch(() => 0)
                .parse(raw)
        })
    }

    streamId() {
        return this.getValue('stream', (raw) => {
            return z
                .union([
                    z.null(),
                    z.object({
                        id: z.string(),
                    }),
                ])
                .catch(() => null)
                .parse(raw)?.id
        })
    }

    stakes() {
        return this.getValue('stakes', (raw) => {
            return z
                .array(
                    z
                        .object({
                            operator: z.object({
                                id: z.string(),
                                metadataJsonString: OperatorMetadataPreparser,
                            }),
                            amountWei: z.string().transform((v) => toBigInt(v)),
                            lockedWei: z.string().transform((v) => toBigInt(v)),
                            joinTimestamp: z.coerce.number(),
                        })
                        .transform((stake) => {
                            const { operator, ...rest } = stake

                            return {
                                ...rest,
                                operator: {
                                    id: operator.id,
                                    metadata: parseOperatorMetadata(
                                        operator.metadataJsonString,
                                        { chainId: this.chainId },
                                    ),
                                },
                            }
                        }),
                )
                .catch(() => [])
                .parse(raw)
        })
    }

    payoutPerSecond() {
        return this.getValue('totalPayoutWeiPerSec', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v))
                .catch(() => 0n)
                .parse(raw)
        })
    }

    payoutPerDay() {
        return this.payoutPerSecond() * 86400n
    }

    totalStakedWei() {
        return this.getValue('totalStakedWei', (raw) => {
            return z
                .string()
                .transform((v) => toBigInt(v))
                .catch(() => 0n)
                .parse(raw)
        })
    }

    timeCorrectedRemainingBalanceWeiAt(timestampInMillis: number) {
        if (!this.isRunning()) {
            return this.remainingBalanceWei()
        }

        const secondsElapsed =
            Math.max(
                0,
                timestampInMillis -
                    (this.remainingBalanceUpdatedAt()?.getTime() ?? timestampInMillis),
            ) / 1000

        const result =
            this.remainingBalanceWei() - toBigInt(secondsElapsed) * this.payoutPerSecond()

        return result > 0n ? result : 0n
    }
}
