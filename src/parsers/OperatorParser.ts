import { z } from 'zod'
import getCoreConfig from '~/getters/getCoreConfig'
import { fromAtto } from '~/marketplace/utils/math'
import { toBN } from '~/utils/bn'

export const OperatorParser = z
    .object({
        cumulativeOperatorsCutWei: z.string().transform(toBN),
        cumulativeProfitsWei: z.string().transform(toBN),
        delegatorCount: z.number(),
        delegators: z.array(
            z
                .object({
                    delegator: z.string(),
                    poolTokenWei: z.string().transform(toBN),
                })
                .transform(({ poolTokenWei: amount, delegator }) => ({
                    amount,
                    delegator,
                })),
        ),
        exchangeRate: z.string().transform(toBN),
        freeFundsWei: z.string().transform(toBN),
        id: z.string(),
        metadata: z
            .string()
            .optional()
            .transform((value = '{}') => {
                try {
                    return JSON.parse(value)
                } catch (e) {
                    console.warn('Failed to parse metadata JSON. Is it JSON?', value, e)
                }

                return {}
            })
            .pipe(
                z
                    .object({
                        name: z
                            .string()
                            .optional()
                            .transform((v) => v || ''),
                        description: z
                            .string()
                            .optional()
                            .transform((v) => v || ''),
                        imageIpfsCid: z.string().optional(),
                        redundancyFactor: z.coerce.number().optional(),
                    })
                    .transform(({ imageIpfsCid, redundancyFactor, ...metadata }) => {
                        const imageUrl = imageIpfsCid
                            ? `${getCoreConfig().ipfs.ipfsGatewayUrl}${imageIpfsCid}`
                            : undefined

                        return {
                            ...metadata,
                            imageUrl,
                            imageIpfsCid,
                            redundancyFactor,
                        }
                    }),
            ),
        nodes: z.array(z.unknown()), // @TODO If needed!
        operatorsCutFraction: z.string().transform(fromAtto),
        owner: z.string(),
        poolTokenTotalSupplyWei: z.string().transform(toBN),
        poolValue: z.string().transform(toBN),
        poolValueBlockNumber: z.coerce.number(),
        poolValueTimestamp: z.coerce.number(),
        queueEntries: z.array(
            z.object({
                amount: z.string().transform(toBN),
                date: z.coerce.number(),
                delegator: z.string(),
                id: z.string(),
            }),
        ),
        slashingEvents: z.array(
            z
                .object({
                    amount: z.string().transform(toBN),
                    data: z.coerce.number(),
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
                    amount: z.string().transform(toBN),
                    allocatedWei: z.string().transform(toBN),
                    joinDate: z.coerce.number(),
                    operator: z.object({
                        id: z.string(),
                    }),
                    sponsorship: z.object({
                        spotAPY: z.string().transform(toBN),
                        projectedInsolvency: z.coerce.number(),
                    }),
                })
                .transform(
                    ({
                        operator: { id: operatorId },
                        sponsorship: {
                            spotAPY,
                            projectedInsolvency: projectedInsolvencyAt,
                        },
                        ...rest
                    }) => ({
                        ...rest,
                        operatorId,
                        spotAPY,
                        projectedInsolvencyAt,
                    }),
                ),
        ),
        totalStakeInSponsorshipsWei: z.string().transform(toBN),
    })
    .transform(({ operatorsCutFraction, ...rest }) => ({
        ...rest,
        operatorsCut: operatorsCutFraction.multipliedBy(100).toNumber(),
    }))

export type ParsedOperator = z.infer<typeof OperatorParser>
