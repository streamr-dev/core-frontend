import { z } from 'zod'
import { fromAtto } from '~/marketplace/utils/math'
import { toBN } from '~/utils/bn'
import { OperatorMetadataParser } from '~/parsers/OperatorMetadataParser'

export const OperatorParser = z
    .object({
        cumulativeOperatorsCutWei: z.string().transform(toBN),
        cumulativeProfitsWei: z.string().transform(toBN),
        dataTokenBalanceWei: z.string().transform(toBN),
        delegatorCount: z.number(),
        delegations: z.array(
            z
                .object({
                    id: z.string(),
                    delegator: z
                        .object({
                            id: z.string(),
                        })
                        .transform(({ id }) => id),
                    valueDataWei: z.string().transform(toBN),
                    operatorTokenBalanceWei: z.string().transform(toBN),
                })
                .transform(({ valueDataWei: amount, ...rest }) => ({
                    ...rest,
                    amount,
                })),
        ),
        exchangeRate: z.string().transform(toBN),
        id: z.string(),
        metadataJsonString: OperatorMetadataParser,
        nodes: z.array(z.string()).transform((nodes) =>
            nodes.map((address) => ({
                address: address.toLowerCase(),
                enabled: true,
                persisted: true,
            })),
        ),
        operatorsCutFraction: z.string().transform(fromAtto),
        owner: z.string(),
        operatorTokenTotalSupplyWei: z.string().transform(toBN),
        valueWithoutEarnings: z.string().transform(toBN),
        valueUpdateBlockNumber: z.coerce.number().optional(),
        valueUpdateTimestamp: z.coerce.number().optional(),
        queueEntries: z.array(
            z.object({
                amount: z.string().transform(toBN),
                date: z.coerce.number(),
                delegator: z.object({ id: z.string() }).transform(({ id }) => id),
                id: z.string(),
            }),
        ),
        slashingEvents: z.array(
            z
                .object({
                    amount: z.string().transform(toBN),
                    date: z.coerce.number(),
                    sponsorship: z.object({
                        stream: z.object({
                            id: z.string(),
                        }),
                    }),
                })
                .transform(({ sponsorship, ...rest }) => ({
                    ...rest,
                    streamId: sponsorship.stream.id,
                })),
        ),
        stakes: z.array(
            z
                .object({
                    amountWei: z.string().transform(toBN),
                    earningsWei: z.string().transform(toBN),
                    joinTimestamp: z.coerce.number(),
                    operator: z.object({
                        id: z.string(),
                    }),
                    sponsorship: z.object({
                        id: z.string(),
                        isRunning: z.boolean(),
                        minimumStakingPeriodSeconds: z.coerce.number(),
                        spotAPY: z.string().transform(toBN),
                        projectedInsolvency: z.coerce.number(),
                        stream: z.object({
                            id: z.string(),
                        }),
                    }),
                })
                .transform(
                    ({
                        operator: { id: operatorId },
                        sponsorship: {
                            id: sponsorshipId,
                            isRunning: isSponsorshipRunning,
                            minimumStakingPeriodSeconds,
                            projectedInsolvency: projectedInsolvencyAt,
                            spotAPY,
                            stream: { id: streamId },
                        },
                        ...rest
                    }) => ({
                        ...rest,
                        sponsorshipId,
                        isSponsorshipRunning,
                        minimumStakingPeriodSeconds,
                        operatorId,
                        projectedInsolvencyAt,
                        spotAPY,
                        streamId,
                    }),
                ),
        ),
        totalStakeInSponsorshipsWei: z.string().transform(toBN),
    })
    .transform(({ operatorsCutFraction, metadataJsonString: metadata, ...rest }) => ({
        ...rest,
        metadata,
        operatorsCut: operatorsCutFraction.multipliedBy(100).toNumber(),
    }))

export type ParsedOperator = z.infer<typeof OperatorParser>
