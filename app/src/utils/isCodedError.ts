import { z } from 'zod'

const CodedError = z.object({
    code: z.number(),
})

export default function isCodedError(e: unknown): e is z.infer<typeof CodedError> {
    return CodedError.safeParse(e).success
}
