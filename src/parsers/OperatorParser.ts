import { z } from 'zod'
import getCoreConfig from '~/getters/getCoreConfig'
import { fromAtto } from '~/marketplace/utils/math'
import { toBN } from '~/utils/bn'

export const OperatorParser = z
    .object({
        cumulativeOperatorsCutWei: z.string().transform(toBN),
        cumulativeProfitsWei: z.string().transform(toBN),
        dataTokenBalanceWei: z.string().transform(toBN),
        delegatorCount: z.number(),
        delegators: z.array(
            z
                .object({
                    delegator: z.string(),
                    delegatedDataWei: z.string().transform(toBN),
                })
                .transform(({ delegatedDataWei: amount, delegator }) => ({
                    amount,
                    delegator,
                })),
        ),
        exchangeRate: z.string().transform(toBN),
        id: z.string(),
        metadataJsonString: z
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
        nodes: z.array(z.string()),
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
                delegator: z.string(),
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
                    amount: z.string().transform(toBN),
                    earningsWei: z.string().transform(toBN),
                    joinDate: z.coerce.number(),
                    operator: z.object({
                        id: z.string(),
                    }),
                    sponsorship: z.object({
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
                            projectedInsolvency: projectedInsolvencyAt,
                            spotAPY,
                            stream: { id: streamId },
                        },
                        ...rest
                    }) => ({
                        ...rest,
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
