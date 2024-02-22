import { z } from 'zod'
import { fromAtto } from '~/marketplace/utils/math'
import { toBN } from '~/utils/bn'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from '~/parsers/OperatorMetadataParser'

const OperatorParser = z.object({
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
                latestDelegationTimestamp: z.coerce.number(),
                earliestUndelegationTimestamp: z.coerce.number(),
            })
            .transform(({ valueDataWei: amount, ...rest }) => ({
                ...rest,
                amount,
            })),
    ),
    id: z.string(),
    metadataJsonString: OperatorMetadataPreparser,
    nodes: z.array(z.string()).transform((nodes) =>
        nodes.map((address) => ({
            address: address.toLowerCase(),
            enabled: true,
            persisted: true,
        })),
    ),
    operatorsCutFraction: z.string().transform(fromAtto),
    owner: z.string(),
    contractVersion: z.coerce.number(),
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
                    id: z.string(),
                    stream: z.object({
                        id: z.string(),
                    }),
                }),
            })
            .transform(({ sponsorship: { id: sponsorshipId, stream }, ...rest }) => ({
                ...rest,
                sponsorshipId,
                streamId: stream.id,
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
                    remainingWei: z.string().transform(toBN),
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
            })
            .transform(
                ({
                    operator: { id: operatorId },
                    sponsorship: {
                        id: sponsorshipId,
                        isRunning,
                        remainingWei,
                        minimumStakingPeriodSeconds,
                        projectedInsolvency: projectedInsolvencyAt,
                        spotAPY,
                        stream,
                    },
                    ...rest
                }) => ({
                    ...rest,
                    sponsorshipId,
                    isSponsorshipPaying: isRunning && remainingWei.isGreaterThan(0),
                    minimumStakingPeriodSeconds,
                    operatorId,
                    projectedInsolvencyAt,
                    spotAPY,
                    streamId: stream?.id,
                }),
            ),
    ),
    totalStakeInSponsorshipsWei: z.string().transform(toBN),
})

export type ParsedOperator = ReturnType<typeof parseOperator>

interface ParseOperatorOptions {
    chainId: number
}

export function parseOperator(value: unknown, options: ParseOperatorOptions) {
    const { chainId } = options

    return OperatorParser.transform(
        ({ operatorsCutFraction, metadataJsonString: metadata, ...rest }) => ({
            ...rest,
            metadata: parseOperatorMetadata(metadata, { chainId }),
            operatorsCut: operatorsCutFraction.multipliedBy(100).toNumber(),
        }),
    ).parse(value)
}
