import { z } from 'zod'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { BN, toBN } from '~/utils/bn'
import { OperatorMetadataParser } from './OperatorMetadataParser'
import { getCurrentChain, getCurrentChainId } from '~/getters/getCurrentChain'

export const SponsorshipParser = z
    .object({
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
                        metadataJsonString: OperatorMetadataParser,
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
    .transform(
        async ({
            cumulativeSponsoring: cumulativeSponsoringWei,
            projectedInsolvency: projectedInsolvencyAt,
            remainingWei,
            stakes,
            stream,
            totalPayoutWeiPerSec,
            totalStakedWei,
            ...rest
        }) => {
            /**
             * @todo Get chain id from the outside. #passchainid
             */
            const chainId = getCurrentChainId()

            const { decimals } = await getSponsorshipTokenInfo(chainId)

            const minimumStakeWei = await getConfigValueFromChain(
                chainId,
                'minimumStakeWei',
            )

            return {
                ...rest,
                cumulativeSponsoring: fromDecimals(cumulativeSponsoringWei, decimals),
                minimumStake: fromDecimals(minimumStakeWei, decimals),
                payoutPerDay: fromDecimals(
                    toBN(totalPayoutWeiPerSec).multipliedBy(86400),
                    decimals,
                ).dp(3, BN.ROUND_HALF_UP),
                projectedInsolvencyAt,
                remainingBalance: fromDecimals(remainingWei, decimals),
                stakes: stakes.map(({ amountWei, ...stake }) => ({
                    ...stake,
                    amount: fromDecimals(amountWei, decimals),
                })),
                streamId: stream?.id,
                totalStake: fromDecimals(totalStakedWei, decimals),
            }
        },
    )

export type ParsedSponsorship = z.infer<typeof SponsorshipParser>
