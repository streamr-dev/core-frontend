import React, { useMemo, useReducer, useState } from 'react'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    FormModalProps,
    Group,
    GroupHeadline,
    Hint,
    Section,
    SectionHeadline,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import { toBN } from '~/utils/bn'
import { FieldWrap, TextAppendix, TextInput } from '~/components/FormComponents'
import { StreamSearchDropdown } from '~/network/components/StreamSearchDropdown'
import {
    CreateSponsorshipFormData,
    CreateSponsorshipFormDataValidator,
} from '~/network/forms/createSponsorshipForm'

const defaultFormData: CreateSponsorshipFormData = {
    streamId: '',
    initialAmount: '',
    payoutRate: '',
    minStakeDuration: 14,
    minNumberOfOperators: 1,
    maxNumberOfOperators: undefined,
}

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (formData: CreateSponsorshipFormData) => void
    onSubmit: (formData: CreateSponsorshipFormData) => Promise<void>
    balance: string
    formData?: Partial<CreateSponsorshipFormData>
    tokenSymbol: string
    tokenDecimals: number
    streamId?: string
}

export default function CreateSponsorshipModal({
    title = 'Create Sponsorship',
    submitLabel = 'Create',
    onResolve,
    onSubmit,
    balance: balanceProp = '0',
    formData: formDataProp = {},
    tokenSymbol,
    tokenDecimals,
    streamId: streamIdProp,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const decimalMultiplier = useMemo(() => Math.pow(10, tokenDecimals), [tokenDecimals])

    const balance = toBN(balanceProp).multipliedBy(decimalMultiplier)

    const [formData, setRawProperties] = useReducer<
        (
            state: CreateSponsorshipFormData,
            change: Partial<CreateSponsorshipFormData>,
        ) => CreateSponsorshipFormData
    >(
        (state, change) => ({
            ...state,
            ...change,
        }),
        defaultFormData,
    )

    const {
        initialAmount,
        streamId,
        payoutRate,
        minStakeDuration,
        minNumberOfOperators,
        maxNumberOfOperators,
    } = formData

    const initialAmountBN = toBN(initialAmount || '0').multipliedBy(decimalMultiplier)
    const payoutRateBN = toBN(payoutRate || '0').multipliedBy(decimalMultiplier)

    const backdropDismissable =
        streamId === defaultFormData.streamId &&
        toBN(initialAmount || '0').toString() ===
            toBN(defaultFormData.initialAmount || '0').toString() &&
        toBN(payoutRate || '0').toString() ===
            toBN(defaultFormData.payoutRate || '0').toString() &&
        minStakeDuration === defaultFormData.minStakeDuration &&
        minNumberOfOperators === defaultFormData.minNumberOfOperators &&
        maxNumberOfOperators === defaultFormData.maxNumberOfOperators

    const extensionInDays =
        payoutRateBN.isGreaterThan(0) && initialAmountBN.isGreaterThanOrEqualTo(0)
            ? initialAmountBN.dividedBy(payoutRateBN).toNumber()
            : 0

    const insufficientFunds = initialAmountBN.isGreaterThan(balance)

    const invalidOperatorNumberRange =
        typeof formData.maxNumberOfOperators !== 'undefined' &&
        formData.minNumberOfOperators > formData.maxNumberOfOperators

    const canSubmit =
        CreateSponsorshipFormDataValidator.safeParse(formData).success &&
        !insufficientFunds

    const invalidMinStakeDuration =
        !!initialAmount && !!payoutRate && extensionInDays < minStakeDuration

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
                    await onSubmit(formData)
                    onResolve?.(formData)
                } catch (e) {
                    console.warn('Error while creating a Sponsorship', e)
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
                    <StreamSearchDropdown
                        onStreamChange={(streamId) => {
                            setRawProperties({
                                streamId,
                            })
                        }}
                        streamId={streamId}
                        disabled={busy}
                        name="streamId"
                    />
                </Section>
            </Group>
            <Group>
                <GroupHeadline>Set Sponsorship parameters</GroupHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label>Initial amount to fund</Label>
                        {insufficientFunds && <ErrorLabel>Insufficient funds</ErrorLabel>}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={insufficientFunds}>
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
                            value={
                                typeof initialAmount !== 'undefined' ? initialAmount : ''
                            }
                        />
                        <TextAppendix>{tokenSymbol}</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            Wallet balance:{' '}
                            <strong>
                                {balance.dividedBy(decimalMultiplier).toString()}{' '}
                                {tokenSymbol}
                            </strong>
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
                            value={typeof payoutRate !== 'undefined' ? payoutRate : ''}
                        />
                        <TextAppendix>{tokenSymbol}/day</TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            The Sponsorship will be funded for{' '}
                            {extensionInDays.toFixed(2).replace(/\.00$/, '')} days
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <WingedLabelWrap>
                        <Label>Minimum time operators must stay staked</Label>
                        {invalidMinStakeDuration && (
                            <ErrorLabel>
                                The value is higher than the duration of the sponsorship
                            </ErrorLabel>
                        )}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={invalidMinStakeDuration}>
                        <TextInput
                            name="minStakeDuration"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minStakeDuration: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof minStakeDuration !== 'undefined'
                                    ? minStakeDuration
                                    : ''
                            }
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Minimum number of operators to start payout</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="minNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    minNumberOfOperators: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof minNumberOfOperators !== 'undefined'
                                    ? minNumberOfOperators
                                    : ''
                            }
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Maximum number of operators</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="maxNumberOfOperators"
                            onChange={({ target }) =>
                                void setRawProperties({
                                    maxNumberOfOperators: target.value
                                        ? Number(target.value)
                                        : undefined,
                                })
                            }
                            placeholder="Leave blank if you don't want to set a limit"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={
                                typeof maxNumberOfOperators !== 'undefined'
                                    ? maxNumberOfOperators
                                    : ''
                            }
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
            </Group>
        </FormModal>
    )
}
