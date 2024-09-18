import { z } from 'zod'
import { ParseError } from '~/errors'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import { toBigInt } from '~/utils/bn'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from './OperatorMetadataParser'

const SponsorshipParser = z.object({
    cumulativeSponsoring: z.string().transform((v) => toBigInt(v || 0)),
    id: z.string(),
    isRunning: z.boolean(),
    minOperators: z.number(),
    maxOperators: z
        .union([z.number(), z.null()])
        .optional()
        .transform((v) => v ?? Number.POSITIVE_INFINITY),
    minimumStakingPeriodSeconds: z.coerce.number(),
    operatorCount: z.number(),
    projectedInsolvency: z.union([
        z.string().transform(Number).pipe(z.number()),
        z.null(),
    ]),
    remainingWei: z.string().transform((v) => toBigInt(v)),
    remainingWeiUpdateTimestamp: z.coerce.number(),
    spotAPY: z.coerce.number(),
    stream: z.union([
        z.object({
            id: z.string(),
        }),
        z.null(),
    ]),
    stakes: z.array(
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
            .transform(
                ({
                    operator: { id: operatorId, metadataJsonString: metadata },
                    ...stake
                }) => ({
                    ...stake,
                    operatorId,
                    metadata,
                }),
            ),
    ),
    totalPayoutWeiPerSec: z.string().transform((v) => toBigInt(v || 0)),
    totalStakedWei: z.string().transform((v) => toBigInt(v || 0)),
})

interface ParseSponsorshipOptions {
    chainId: number
    now?: number
}

export async function parseSponsorship(value: unknown, options: ParseSponsorshipOptions) {
    const { chainId } = options

    const now = options.now ?? Date.now()

    try {
        return await SponsorshipParser.transform(
            async ({
                projectedInsolvency: projectedInsolvencyAt,
                remainingWei,
                remainingWeiUpdateTimestamp,
                stakes,
                stream,
                totalPayoutWeiPerSec,
                isRunning,
                ...rest
            }) => {
                const minimumStakeWei = await getConfigValueFromChain(
                    chainId,
                    'minimumStakeWei',
                )

                const timeCorrectedRemainingBalance = ((value) =>
                    value < 0n ? 0n : value)(
                    remainingWei -
                        toBigInt(now / 1000 - remainingWeiUpdateTimestamp) *
                            totalPayoutWeiPerSec,
                )

                return {
                    ...rest,
                    minimumStakeWei,
                    payoutPerSec: totalPayoutWeiPerSec,
                    payoutPerDay: totalPayoutWeiPerSec * 86400n,
                    projectedInsolvencyAt,
                    remainingBalanceWei: remainingWei,
                    // @todo Rename remainingWeiUpdateTimestamp to remainingBalanceUpdatedAt
                    remainingWeiUpdateTimestamp,
                    timeCorrectedRemainingBalance: isRunning
                        ? timeCorrectedRemainingBalance
                        : remainingWei,
                    stakes: stakes.map(({ metadata, ...stake }) => ({
                        ...stake,
                        metadata: parseOperatorMetadata(metadata, { chainId }),
                    })),
                    streamId: stream?.id,
                    isRunning,
                }
            },
        ).parseAsync(value)
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw new ParseError(value, e)
        }

        throw e
    }
}

export type ParsedSponsorship = Awaited<ReturnType<typeof parseSponsorship>>
