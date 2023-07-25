import { z } from 'zod'

function optional(t: z.ZodTypeAny) {
    return z.optional(z.null().or(z.undefined()).or(t))
}

export const ProjectMetadata = z.object({
    name: optional(z.string()),
    description: optional(z.string()),
    imageUrl: optional(z.string()),
    imageIpfsCid: optional(z.string()),
    creator: optional(z.string()),
    termsOfUse: optional(
        z.object({
            commercialUse: optional(z.boolean()),
            redistribution: optional(z.boolean()),
            reselling: optional(z.boolean()),
            storage: optional(z.boolean()),
            termsName: optional(z.string()),
            termsUrl: optional(z.string()),
        }),
    ),
    contactDetails: optional(
        z.object({
            url: optional(z.string()),
            email: optional(z.string()),
            twitter: optional(z.string()),
            telegram: optional(z.string()),
            reddit: optional(z.string()),
            linkedIn: optional(z.string()),
        }),
    ),
    isDataUnion: z.boolean().or(z.undefined()),
})

export type ProjectMetadata = z.infer<typeof ProjectMetadata>

export const PaymentDetail = z.object({
    domainId: z.optional(z.string()),
    beneficiary: z.string(),
    pricingTokenAddress: z.string(),
    pricePerSecond: z.optional(z.string()),
})

export const ProjectSubscription = z.object({
    userAddress: z.string(),
    endTimestamp: z.optional(z.string()),
})

export const ProjectPermissions = z.object({
    canBuy: z.boolean(),
    canDelete: z.boolean(),
    canEdit: z.boolean(),
    canGrant: z.boolean(),
})

export const GraphProjectPermissions = ProjectPermissions.extend({
    userAddress: z.string(),
})

export const GraphProject = z.object({
    id: z.string(),
    paymentDetails: z.array(PaymentDetail),
    minimumSubscriptionSeconds: z.string(),
    isDataUnion: z.optional(z.boolean().or(z.null()).or(z.undefined())),
    subscriptions: z.array(ProjectSubscription),
    metadata: ProjectMetadata,
    streams: z.array(z.string()),
    permissions: z.array(GraphProjectPermissions),
    purchases: z.array(
        z.object({
            subscriber: z.string(),
            subscriptionSeconds: z.string(),
            price: z.string(),
            fee: z.string(),
        }),
    ),
})

export const ObjectWithMessage = z.object({
    message: z.string(),
})
