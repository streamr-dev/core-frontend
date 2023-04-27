import { z } from 'zod'

export const ProjectDetail = z.object({
    domainId: z.string(),
    beneficiary: z.string(),
    pricingTokenAddress: z.string(),
    pricePerSecond: z.string(),
})

export const GraphProject = z.object({
    id: z.string(),
    paymentDetails: z.array(ProjectDetail),
    minimumSubscriptionSeconds: z.string(),
    subscriptions: z.array(
        z.object({
            userAddress: z.string(),
            endTimestamp: z.string(),
        }),
    ),
    metadata: z.object({
        name: z.string(),
        description: z.string(),
        imageUrl: z.string().or(z.undefined()),
        imageIpfsCid: z.string().or(z.undefined()),
        creator: z.string().or(z.undefined()),
        termsOfUse: z
            .object({
                commercialUse: z.boolean().or(z.undefined()),
                redistribution: z.boolean().or(z.undefined()),
                reselling: z.boolean().or(z.undefined()),
                storage: z.boolean().or(z.undefined()),
                termsName: z.string().or(z.null()).or(z.undefined()),
                termsUrl: z.string().or(z.null()).or(z.undefined()),
            })
            .or(z.undefined()),
        contactDetails: z
            .object({
                url: z.string().or(z.null()).or(z.undefined()),
                email: z.string().or(z.null()).or(z.undefined()),
                twitter: z.string().or(z.null()).or(z.undefined()),
                telegram: z.string().or(z.null()).or(z.undefined()),
                reddit: z.string().or(z.null()).or(z.undefined()),
                linkedIn: z.string().or(z.null()).or(z.undefined()),
            })
            .or(z.undefined()),
        isDataUnion: z.boolean().or(z.undefined()),
    }),
    streams: z.array(z.string()),
    permissions: z.array(
        z.object({
            canBuy: z.boolean(),
            canDelete: z.boolean(),
            canEdit: z.boolean(),
            canGrant: z.boolean(),
            userAddress: z.string(),
        }),
    ),
    purchases: z.array(
        z.object({
            subscriber: z.string(),
            subscriptionSeconds: z.string(),
            price: z.string(),
            fee: z.string(),
        }),
    ),
})
