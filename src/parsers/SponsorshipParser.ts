import { z } from 'zod'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fromAtto, fromDecimals, toDecimals } from '~/marketplace/utils/math'
import { BN, toBN } from '~/utils/bn'
import { OperatorMetadataParser } from './OperatorMetadataParser'

export const SponsorshipParser = z
    .object({
        cumulativeSponsoring: z.string(), // wei
        id: z.string(),
        isRunning: z.boolean(),
        minimumStakingPeriodSeconds: z.coerce.number(),
        operatorCount: z.number(),
        projectedInsolvency: z.coerce.number(),
        spotAPY: z.string().transform(fromAtto),
        stream: z.object({
            id: z.string(),
        }),
        stakes: z.array(
            z
                .object({
                    operator: z.object({
                        id: z.string(),
                        metadataJsonString: OperatorMetadataParser,
                    }),
                    amount: z.string(), // wei
                    joinDate: z.coerce.number(),
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
            isRunning: active,
            projectedInsolvency: projectedInsolvencyAt,
            spotAPY,
            stakes,
            stream: { id: streamId },
            totalPayoutWeiPerSec,
            totalStakedWei,
            ...rest
        }) => {
            const { decimals } = await getSponsorshipTokenInfo()

            const minimumStakeWei = await getConfigValueFromChain('minimumStakeWei')

            return {
                ...rest,
                active,
                apy: toDecimals(spotAPY, decimals).toNumber(),
                cumulativeSponsoring: fromDecimals(cumulativeSponsoringWei, decimals),
                minimumStake: fromDecimals(minimumStakeWei, decimals),
                payoutPerDay: fromDecimals(
                    toBN(totalPayoutWeiPerSec).multipliedBy(86400),
                    decimals,
                ).dp(3, BN.ROUND_HALF_UP),
                projectedInsolvencyAt,
                stakes: stakes.map(({ amount: amountWei, ...stake }) => ({
                    ...stake,
                    amount: fromDecimals(amountWei, decimals),
                })),
                streamId,
                totalStake: fromDecimals(totalStakedWei, decimals),
            }
        },
    )

export type ParsedSponsorship = z.infer<typeof SponsorshipParser>
