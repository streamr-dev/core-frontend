import { z } from 'zod'
import { ParseError } from '~/errors'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from '~/parsers/OperatorMetadataParser'
import { toBN, toBigInt, toFloat } from '~/utils/bn'

const OperatorParser = z.object({
    cumulativeOperatorsCutWei: z.string().transform((v) => toBigInt(v)),
    cumulativeProfitsWei: z.string().transform((v) => toBigInt(v)),
    dataTokenBalanceWei: z.string().transform((v) => toBigInt(v)),
    delegatorCount: z.number(),
    delegations: z.array(
        z.object({
            id: z.string(),
            delegator: z
                .object({
                    id: z.string(),
                })
                .transform(({ id }) => id),
            operatorTokenBalanceWei: z.string().transform((v) => toBigInt(v)),
            latestDelegationTimestamp: z.coerce.number(),
            earliestUndelegationTimestamp: z.coerce.number(),
        }),
    ),
    exchangeRate: z.string().transform(toBN),
    id: z.string(),
    metadataJsonString: OperatorMetadataPreparser,
    nodes: z.array(z.string()).transform((nodes) =>
        nodes.map((address) => ({
            address: address.toLowerCase(),
            enabled: true,
            persisted: true,
        })),
    ),
    controllers: z.array(z.string()).transform((controllers) =>
        controllers.map((address) => ({
            address: address.toLowerCase(),
            enabled: true,
            persisted: true,
        })),
    ),
    operatorsCutFraction: z.string().transform((v) => toBigInt(v)),
    owner: z.string(),
    contractVersion: z.coerce.number(),
    operatorTokenTotalSupplyWei: z.string().transform((v) => toBigInt(v)),
    valueWithoutEarnings: z.string().transform((v) => toBigInt(v)),
    valueUpdateBlockNumber: z.coerce.number().optional(),
    valueUpdateTimestamp: z.coerce.number().optional(),
    queueEntries: z.array(
        z.object({
            amount: z.string().transform((v) => toBigInt(v)),
            date: z.coerce.number(),
            delegator: z.object({ id: z.string() }).transform(({ id }) => id),
            id: z.string(),
        }),
    ),
    slashingEvents: z.array(
        z
            .object({
                amount: z.string().transform((v) => toBigInt(v)),
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
                amountWei: z.string().transform((v) => toBigInt(v)),
                earningsWei: z.string().transform((v) => toBigInt(v)),
                joinTimestamp: z.coerce.number(),
                operator: z.object({
                    id: z.string(),
                }),
                sponsorship: z.object({
                    id: z.string(),
                    isRunning: z.boolean(),
                    remainingWei: z.string().transform((v) => toBigInt(v)),
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
                    isSponsorshipPaying: isRunning && remainingWei > 0n,
                    remainingWei,
                    minimumStakingPeriodSeconds,
                    operatorId,
                    projectedInsolvencyAt,
                    spotAPY,
                    streamId: stream?.id,
                }),
            ),
    ),
    totalStakeInSponsorshipsWei: z.string().transform((v) => toBigInt(v)),
})

export type ParsedOperator = ReturnType<typeof parseOperator>

interface ParseOperatorOptions {
    chainId: number
}

export function parseOperator(value: unknown, options: ParseOperatorOptions) {
    const { chainId } = options

    try {
        return OperatorParser.transform(
            ({
                operatorsCutFraction,
                metadataJsonString: metadata,
                exchangeRate,
                delegations,
                ...rest
            }) => ({
                ...rest,
                exchangeRate,
                metadata: parseOperatorMetadata(metadata, { chainId }),
                operatorsCut: toFloat(operatorsCutFraction, 18n)
                    .multipliedBy(100)
                    .toNumber(),
                delegations: delegations.map((d) => ({
                    ...d,
                    amount: toBigInt(
                        toBN(d.operatorTokenBalanceWei).multipliedBy(exchangeRate),
                    ),
                })),
            }),
        ).parse(value)
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw new ParseError(value, e)
        }

        throw e
    }
}
