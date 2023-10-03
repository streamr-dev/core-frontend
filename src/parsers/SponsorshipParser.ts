import { z } from 'zod'
import { getConfigFromChain } from '~/getters/getConfigFromChain'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fromAtto, fromDecimals } from '~/marketplace/utils/math'

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
                    }),
                    amount: z.string(), // wei
                    joinDate: z.coerce.number(),
                })
                .transform(({ operator: { id: operatorId }, ...stake }) => ({
                    ...stake,
                    operatorId,
                })),
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

            const { minimumStakeWei } = await getConfigFromChain()

            return {
                ...rest,
                active,
                apy: spotAPY.toNumber(),
                cumulativeSponsoring: fromDecimals(cumulativeSponsoringWei, decimals),
                minimumStake: fromDecimals(minimumStakeWei, decimals),
                payoutPerDay: fromDecimals(totalPayoutWeiPerSec, decimals).dividedBy(
                    86400,
                ),
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
