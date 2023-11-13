import React, { useReducer, useState } from 'react'
import { toaster } from 'toasterhea'
import { RejectionReason, isRejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    ErrorWrap,
    FieldWrap,
    FormModalProps,
    Group,
    GroupHeadline,
    Hint,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import { BN, toBN } from '~/utils/bn'
import {
    CreateSponsorshipForm,
    MinNumberOfOperatorsParser,
} from '~/forms/createSponsorshipForm'
import { useConfigValueFromChain } from '~/hooks'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { toDecimals } from '~/marketplace/utils/math'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { createSponsorship } from '~/services/sponsorships'
import { isTransactionRejection, waitForIndexedBlock } from '~/utils'
import { StreamIdDropdown } from '~/components/StreamIdDropdown'
import { checkIfStreamExists } from '~/services/streams'
import { errorToast } from '~/utils/toast'
import Toast from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'

const defaultFormData: CreateSponsorshipForm = {
    streamId: '',
    initialAmount: '',
    payoutRate: '',
    minStakeDuration: 14,
    minNumberOfOperators: 1,
    maxNumberOfOperators: undefined,
}

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: BN
    onResolve?: (sponsorshipId: string) => void
}

const streamNotFoundToaster = toaster(Toast, Layer.Toast)

function CreateSponsorshipModal({ balance: balanceProp, onResolve, ...props }: Props) {
    const [busy, setBusy] = useState(false)

    const { decimals = 18 } = useSponsorshipTokenInfo() || {}

    const balance = toDecimals(balanceProp, decimals)

    const [formData, setRawProperties] = useReducer<
        (
            state: CreateSponsorshipForm,
            change: Partial<CreateSponsorshipForm>,
        ) => CreateSponsorshipForm
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

    const initialAmountBN = toDecimals(initialAmount || '0', decimals)

    const payoutRateBN = toDecimals(payoutRate || '0', decimals)

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

    const tooLowOperatorCount = !MinNumberOfOperatorsParser.safeParse(
        formData.minNumberOfOperators,
    ).success

    const canSubmit =
        CreateSponsorshipForm.safeParse(formData).success && !insufficientFunds

    const invalidMinStakeDuration =
        !!initialAmount && !!payoutRate && extensionInDays < minStakeDuration

    const maxPenaltyPeriodSeconds = useConfigValueFromChain('maxPenaltyPeriodSeconds')

    const maxPenaltyPeriod =
        typeof maxPenaltyPeriodSeconds === 'undefined'
            ? void 0
            : toBN(maxPenaltyPeriodSeconds).dividedBy(86400).toNumber()

    const tooLongMinStakeDuration =
        !!maxPenaltyPeriod && minStakeDuration > maxPenaltyPeriod

    return (
        <FormModal
            {...props}
            title="Create Sponsorship"
            canSubmit={canSubmit && !busy}
            submitLabel="Create"
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
                    if (!(await checkIfStreamExists(formData.streamId))) {
                        errorToast(
                            { title: 'Stream does not exist' },
                            streamNotFoundToaster,
                        )

                        return
                    }

                    const sponsorshipId = await createSponsorship(formData, {
                        onBlockNumber: waitForIndexedBlock,
                    })

                    onResolve?.(sponsorshipId)
                } catch (e) {
                    if (isRejectionReason(e)) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    throw e
                } finally {
                    setBusy(false)
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
                    <StreamIdDropdown
                        autoFocus
                        placeholder="Type to select a stream"
                        disabled={busy}
                        onChange={(streamId) => {
                            setRawProperties({
                                streamId,
                            })
                        }}
                        value={streamId}
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
                            step="any"
                            value={initialAmount || ''}
                        />
                        <TextAppendix>
                            <SponsorshipPaymentTokenName />
                        </TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            Wallet balance:{' '}
                            <strong>
                                {balanceProp.toString()} <SponsorshipPaymentTokenName />
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
                            step="any"
                            value={payoutRate || ''}
                        />
                        <TextAppendix>
                            <SponsorshipPaymentTokenName />
                            /day
                        </TextAppendix>
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
                        <ErrorWrap>
                            {invalidMinStakeDuration && (
                                <ErrorLabel>
                                    The value is higher than the duration of the
                                    sponsorship
                                </ErrorLabel>
                            )}
                            {tooLongMinStakeDuration && (
                                <ErrorLabel>
                                    Max amount: {maxPenaltyPeriod} days
                                </ErrorLabel>
                            )}
                        </ErrorWrap>
                    </WingedLabelWrap>
                    <FieldWrap
                        $invalid={invalidMinStakeDuration || tooLongMinStakeDuration}
                    >
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
                            value={minStakeDuration || ''}
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label>Minimum number of operators to start payout</Label>
                    <FieldWrap
                        $invalid={invalidOperatorNumberRange || tooLowOperatorCount}
                    >
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

export const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)
