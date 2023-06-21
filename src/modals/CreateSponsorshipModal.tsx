import React, { useEffect, useReducer, useState } from 'react'
import BigNumber from 'bignumber.js'
import { z } from 'zod'
import { RejectionReason } from '$app/src/modals/BaseModal'
import FormModal, {
    FieldWrap,
    FormModalProps,
    Group,
    GroupHeadline,
    Hint,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
} from '$app/src/modals/FormModal'
import Label from '$ui/Label'

interface RawFormData {
    streamId: string
    initialAmount: string
    payoutRate: string
    minStakeDuration: string
    minNumberOfOperators: string
    maxNumberOfOperators: string
}

const FormData = z
    .object({
        streamId: z.string().trim().min(1),
        initialAmount: z
            .string()
            .refine((value) => new BigNumber(value).isGreaterThanOrEqualTo(0)),
        payoutRate: z.string().refine((value) => new BigNumber(value).isGreaterThan(0)),
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
            .refine((value) => Number.isSafeInteger(value)),
    })
    .refine(
        ({ minNumberOfOperators, maxNumberOfOperators }) =>
            maxNumberOfOperators >= minNumberOfOperators,
        {
            message: 'invalid range of operator numbers',
        },
    )

type FormData = z.infer<typeof FormData>

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (formData: FormData) => void
    balance?: string
    formData: Partial<FormData>
}

function getRawFormData(formData: Partial<FormData>): RawFormData {
    return {
        initialAmount: !formData.initialAmount
            ? ''
            : new BigNumber(formData.initialAmount).dividedBy(1e18).toString(),
        streamId: formData.streamId || '',
        payoutRate: !formData.payoutRate
            ? ''
            : new BigNumber(formData.payoutRate).dividedBy(1e18).toString(),
        minStakeDuration:
            typeof formData.minStakeDuration === 'undefined'
                ? ''
                : `${formData.minStakeDuration}`,
        minNumberOfOperators:
            typeof formData.minNumberOfOperators === 'undefined'
                ? ''
                : `${formData.minNumberOfOperators}`,
        maxNumberOfOperators:
            typeof formData.maxNumberOfOperators === 'undefined'
                ? ''
                : `${formData.maxNumberOfOperators}`,
    }
}

export default function CreateSponsorshipModal({
    title = 'Create Sponsorship',
    submitLabel = 'Create',
    onResolve,
    balance: balanceProp = '0',
    formData: formDataProp = {},
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const balance = new BigNumber(balanceProp)

    const initialRawFormData = getRawFormData(formDataProp)

    const [
        {
            initialAmount: rawInitialAmount,
            streamId: rawStreamId,
            payoutRate: rawPayoutRate,
            minStakeDuration: rawMinStakeDuration,
            minNumberOfOperators: rawMinNumberOfOperators,
            maxNumberOfOperators: rawMaxNumberOfOperators,
        },
        setRawProperties,
    ] = useReducer<(state: RawFormData, change: Partial<RawFormData>) => RawFormData>(
        (state, change) => ({
            ...state,
            ...change,
        }),
        initialRawFormData,
    )

    const initialAmountBN = new BigNumber(rawInitialAmount || '0').multipliedBy(1e18)

    const initialAmount = initialAmountBN.toString()

    const payoutRateBN = new BigNumber(rawPayoutRate || '0').multipliedBy(1e18)

    const payoutRate = payoutRateBN.toString()

    const minStakeDuration = rawMinStakeDuration || '0'

    const minNumberOfOperators = rawMinNumberOfOperators || '0'

    const maxNumberOfOperators = rawMaxNumberOfOperators || '0'

    /**
     * @TODO Implement a search feature and a dropdown.
     */
    const streamId = rawStreamId

    const formData: FormData = {
        streamId,
        initialAmount,
        payoutRate,
        minStakeDuration: Number.parseInt(minStakeDuration),
        minNumberOfOperators: Number.parseInt(minNumberOfOperators),
        maxNumberOfOperators: Number.parseInt(maxNumberOfOperators),
    }

    const canSubmit = FormData.safeParse(formData).success

    const backdropDismissable =
        rawStreamId === initialRawFormData.streamId &&
        new BigNumber(rawInitialAmount || '0').toString() ===
            new BigNumber(initialRawFormData.initialAmount || '0').toString() &&
        new BigNumber(rawPayoutRate || '0').toString() ===
            new BigNumber(initialRawFormData.payoutRate || '0').toString() &&
        minStakeDuration === (initialRawFormData.minStakeDuration || '0') &&
        minNumberOfOperators === (initialRawFormData.minNumberOfOperators || '0') &&
        maxNumberOfOperators === (initialRawFormData.maxNumberOfOperators || '0')

    const extensionInDays =
        payoutRateBN.isGreaterThan(0) && initialAmountBN.isGreaterThanOrEqualTo(0)
            ? initialAmountBN.dividedBy(payoutRateBN).toNumber()
            : 0

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (backdropDismissable || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    await new Promise((resolve) => void setTimeout(resolve, 2000))

                    onResolve?.(formData)
                } catch (e) {
                    console.warn('Error while becoming an operator', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <Group>
                <GroupHeadline>Select a Stream</GroupHeadline>
                <SectionHeadline>
                    Your Sponsorship will incentivize nodes to relay and secure this
                    stream
                </SectionHeadline>
                <Section>
                    <Label>Select a Stream</Label>
                    <FieldWrap>
                        <TextInput
                            name="streamId"
                            autoFocus
                            onChange={({ target }) =>
                                void setRawProperties({
                                    streamId: target.value,
                                })
                            }
                            placeholder="Type to select a stream"
                            readOnly={busy}
                            type="text"
                            value={streamId}
                        />
                    </FieldWrap>
                </Section>
            </Group>
            <Group>
                <GroupHeadline>Set Sponsorship parameters</GroupHeadline>
                <Section>
                    <Label>Initial amount to fund</Label>
                    <FieldWrap>
                        <TextInput
                            name="initialAmount"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    initialAmount: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawInitialAmount}
                        />
                        <TextAppendix>DATA</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            Wallet balance:{' '}
                            <strong>{balance.dividedBy(1e18).toString()} DATA</strong>
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <Label>Payout rate*</Label>
                    <FieldWrap>
                        <TextInput
                            name="payoutRate"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    payoutRate: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawPayoutRate}
                        />
                        <TextAppendix>DATA/day</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            The Sponsorship will be funded for{' '}
                            {extensionInDays.toFixed(2).replace(/\.00$/, '')} days
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <Label>Minimum time Operators must stay staked</Label>
                    <FieldWrap>
                        <TextInput
                            name="minStakeDuration"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minStakeDuration: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinStakeDuration}
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Minimum number of Operators</Label>
                    <FieldWrap>
                        <TextInput
                            name="minNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minNumberOfOperators: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinNumberOfOperators}
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Maximum number of Operators</Label>
                    <FieldWrap>
                        <TextInput
                            name="maxNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    maxNumberOfOperators: target.value,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMaxNumberOfOperators}
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
            </Group>
        </FormModal>
    )
}
