import { z } from 'zod'
import { getSponsorshipExtensionInDays } from '~/utils/sponsorships'

export const MinNumberOfOperatorsParser = z
    .number()
    .gte(1)
    .refine((value) => Number.isSafeInteger(value))

const CreateSponsorshipForm = z
    .object({
        streamId: z.string().trim().min(1),
        initialAmount: z.bigint().min(0n),
        dailyPayoutRate: z.bigint().gt(0n),
        minStakeDuration: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value)),
        minNumberOfOperators: MinNumberOfOperatorsParser,
        maxNumberOfOperators: z
            .number()
            .gte(0)
            .refine((value) => Number.isSafeInteger(value))
            .optional(),
    })
    .refine(
        ({ minNumberOfOperators: min, maxNumberOfOperators: max }) =>
            typeof max === 'undefined' || max >= min,
        {
            message: 'invalid range of operator numbers',
            path: ['maxNumberOfOperators'],
        },
    )
    .refine(
        ({ initialAmount, dailyPayoutRate, minStakeDuration }) =>
            getSponsorshipExtensionInDays(initialAmount, dailyPayoutRate) >=
            minStakeDuration,
        {
            message: 'Payout rate is lower than minimum stake duration',
            path: ['minStakeDuration'],
        },
    )

export type CreateSponsorshipForm = z.infer<typeof CreateSponsorshipForm>

export function isValidCreateSponsorshipForm(input: CreateSponsorshipForm): boolean {
    return CreateSponsorshipForm.safeParse(input).success
}
