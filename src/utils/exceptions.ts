import { z } from 'zod'

export const RejectionReason = {
    CloseButton: Symbol('close button'),
    Backdrop: Symbol('backdrop'),
    EscapeKey: Symbol('escape key'),
    CancelButton: Symbol('cancel'),
    BackButton: Symbol('back button'),
}

export function isRejectionReason(value: unknown) {
    return (
        value === RejectionReason.CloseButton ||
        value === RejectionReason.Backdrop ||
        value === RejectionReason.EscapeKey ||
        value === RejectionReason.CancelButton ||
        value === RejectionReason.BackButton
    )
}

const CodedError = z.object({
    code: z.number(),
})

export function isCodedError(e: unknown): e is z.infer<typeof CodedError> {
    return CodedError.safeParse(e).success
}

const ObjectWithMessage = z.object({
    message: z.string(),
})

export function isMessagedObject(e: unknown): e is z.infer<typeof ObjectWithMessage> {
    return ObjectWithMessage.safeParse(e).success
}

export function isTransactionRejection(e: unknown) {
    return (
        (isCodedError(e) && e.code === 4001) ||
        (isMessagedObject(e) && /action_rejected/i.test(e.message))
    )
}
