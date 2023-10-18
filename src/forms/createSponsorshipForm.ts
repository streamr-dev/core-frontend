import { z } from 'zod'
import { toBN } from '~/utils/bn'

export const CreateSponsorshipForm = z
    .object({
        streamId: z.string().trim().min(1),
        initialAmount: z
            .string()
            .refine((value) => toBN(value).isGreaterThanOrEqualTo(0)),
        payoutRate: z.string().refine((value) => toBN(value).isGreaterThan(0)),
        minStakeDuration: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value)),
        minNumberOfOperators: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value)),
        maxNumberOfOperators: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value))
            .optional(),
    })
    .refine(
        ({ minNumberOfOperators, maxNumberOfOperators }) => {
            if (typeof maxNumberOfOperators === 'undefined') {
                return true
            }
            return maxNumberOfOperators >= minNumberOfOperators
        },
        {
            message: 'invalid range of operator numbers',
            path: ['maxNumberOfOperators'],
        },
    )
    .refine(
        ({ initialAmount, payoutRate, minStakeDuration }) => {
            const payoutRateBN = toBN(payoutRate)
            const initialAmountBN = toBN(initialAmount)
            const extensionInDays =
                payoutRateBN.isGreaterThan(0) && initialAmountBN.isGreaterThanOrEqualTo(0)
                    ? initialAmountBN.dividedBy(payoutRateBN).toNumber()
                    : 0
            return toBN(extensionInDays).isGreaterThanOrEqualTo(toBN(minStakeDuration))
        },
        {
            message: 'Payout rate is lower than minimum stake duration',
            path: ['minStakeDuration'],
        },
    )
export type CreateSponsorshipForm = z.infer<typeof CreateSponsorshipForm>
