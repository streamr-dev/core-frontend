import { z } from 'zod'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { BN, toBN } from '~/utils/bn'
import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from './OperatorMetadataParser'

const SponsorshipParser = z.object({
    cumulativeSponsoring: z.string(), // wei
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
    remainingWei: z.string().transform(toBN),
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
                amountWei: z.string(), // wei
                lockedWei: z.string().transform(toBN),
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
    totalPayoutWeiPerSec: z.string(),
    totalStakedWei: z.string(),
})

interface ParseSponsorshipOptions {
    chainId: number
}

export function parseSponsorship(value: unknown, options: ParseSponsorshipOptions) {
    const { chainId } = options

    return SponsorshipParser.transform(
        async ({
            cumulativeSponsoring: cumulativeSponsoringWei,
            projectedInsolvency: projectedInsolvencyAt,
            remainingWei,
            remainingWeiUpdateTimestamp,
            stakes,
            stream,
            totalPayoutWeiPerSec,
            totalStakedWei,
            isRunning,
            ...rest
        }) => {
            const { decimals } = await getSponsorshipTokenInfo(chainId)

            const minimumStakeWei = await getConfigValueFromChain(
                chainId,
                'minimumStakeWei',
            )

            const timeCorrectedRemainingBalance = remainingWei.isGreaterThan(0)
                ? fromDecimals(
                      remainingWei.minus(
                          toBN(
                              Date.now() / 1000 - remainingWeiUpdateTimestamp,
                          ).multipliedBy(totalPayoutWeiPerSec),
                      ),
                      decimals,
                  )
                : toBN(0)

            return {
                ...rest,
                cumulativeSponsoring: fromDecimals(cumulativeSponsoringWei, decimals),
                minimumStake: fromDecimals(minimumStakeWei, decimals),
                payoutPerSec: fromDecimals(toBN(totalPayoutWeiPerSec), decimals),
                payoutPerDay: fromDecimals(
                    toBN(totalPayoutWeiPerSec).multipliedBy(86400),
                    decimals,
                ).dp(3, BN.ROUND_HALF_UP),
                projectedInsolvencyAt,
                remainingBalance: fromDecimals(remainingWei, decimals),
                remainingWeiUpdateTimestamp,
                timeCorrectedRemainingBalance:
                    timeCorrectedRemainingBalance.isGreaterThan(0) && isRunning
                        ? timeCorrectedRemainingBalance
                        : fromDecimals(remainingWei, decimals),
                stakes: stakes.map(({ amountWei, metadata, ...stake }) => ({
                    ...stake,
                    amount: fromDecimals(amountWei, decimals),
                    metadata: parseOperatorMetadata(metadata, { chainId }),
                })),
                streamId: stream?.id,
                totalStake: fromDecimals(totalStakedWei, decimals),
                isRunning,
            }
        },
    ).parseAsync(value)
}

export type ParsedSponsorship = Awaited<ReturnType<typeof parseSponsorship>>
