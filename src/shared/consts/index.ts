import { z } from 'zod'

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

export const ObjectWithMessage = z.object({
    message: z.string(),
})
