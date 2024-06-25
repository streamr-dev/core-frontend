import { z } from 'zod'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from './OperatorMetadataParser'

const SponsorshipParser = z.object({
    cumulativeSponsoring: z.string().transform(BigInt),
    id: z.string(),
    isRunning: z.boolean(),
    minOperators: z.number(),
    maxOperators: z
        .union([z.number(), z.null()])
        .optional()
        .transform((v) => v ?? Number.POSITIVE_INFINITY),
    minimumStakingPeriodSeconds: z.coerce.number(),
    operatorCount: z.number(),
    projectedInsolvency: z
        .union([z.string(), z.null()])
        .transform((v) => (v == null ? null : Number(v))),
    remainingWei: z.string().transform(BigInt),
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
                amountWei: z.string().transform(BigInt),
                lockedWei: z.string().transform(BigInt),
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
    totalPayoutWeiPerSec: z.string().transform(BigInt),
    totalStakedWei: z.string().transform(BigInt),
})

interface ParseSponsorshipOptions {
    chainId: number
}

export function parseSponsorship(value: unknown, options: ParseSponsorshipOptions) {
    const { chainId } = options

    return SponsorshipParser.transform(
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

            const timeCorrectedRemainingBalance = ((value) => (value < 0n ? 0n : value))(
                remainingWei -
                    BigInt(Date.now() / 1000 - remainingWeiUpdateTimestamp) *
                        totalPayoutWeiPerSec,
            )

            return {
                ...rest,
                minimumStakeWei,
                payoutPerSec: totalPayoutWeiPerSec,
                payoutPerDay: totalPayoutWeiPerSec * 86400n,
                projectedInsolvencyAt,
                remainingBalanceWei: remainingWei,
                remainingWeiUpdateTimestamp,
                timeCorrectedRemainingBalance:
                    timeCorrectedRemainingBalance > 0n && isRunning
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
}

export type ParsedSponsorship = Awaited<ReturnType<typeof parseSponsorship>>
