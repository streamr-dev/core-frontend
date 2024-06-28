import React, { useState } from 'react'
import { toaster } from 'toasterhea'
import { SponsorshipDecimals } from '~/components/Decimals'
import { SponsorshipDisclaimer } from '~/components/SponsorshipDisclaimer'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { StreamIdDropdown } from '~/components/StreamIdDropdown'
import { DayInSeconds } from '~/consts'
import {
    CreateSponsorshipForm,
    MinNumberOfOperatorsParser,
    isValidCreateSponsorshipForm,
} from '~/forms/createSponsorshipForm'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
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
import { createSponsorship } from '~/services/sponsorships'
import { checkIfStreamExists } from '~/services/streams'
import Label from '~/shared/components/Ui/Label'
import Toast from '~/shared/toasts/Toast'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { toBigInt } from '~/utils/bn'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
import { getSponsorshipExtensionInDays } from '~/utils/sponsorships'
import { errorToast } from '~/utils/toast'

interface ResolveProps {
    blockNumber: number
    sponsorshipId: string
    streamId?: string
}

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: bigint
    chainId: number
    streamId?: string
    onResolve?: (props: ResolveProps) => void
}

const streamNotFoundToaster = toaster(Toast, Layer.Toast)

function CreateSponsorshipModal({
    balance,
    chainId,
    streamId: streamIdProp = '',
    onResolve,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const [confirmState, setConfirmState] = useState(false)

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    const [streamId, setStreamId] = useState(streamIdProp)

    const [rawInitialAmount, setRawInitialAmount] = useState('')

    const initialAmount = toBigInt(rawInitialAmount || 0, decimals)

    const [rawDailyPayoutRate, setRawDailyPayoutRate] = useState('')

    const dailyPayoutRate = toBigInt(rawDailyPayoutRate || 0, decimals)

    const [rawMinStakeDurationInDays, setRawMinStakeDurationInDays] = useState('')

    const minStakeDuration = Math.max(0, Number(rawMinStakeDurationInDays) || 0)

    const [rawMinNumberOfOperators, setRawMinNumberOfOperators] = useState('1')

    const minNumberOfOperators = Math.max(0, Number(rawMinNumberOfOperators) || 0)

    const [rawMaxNumberOfOperators, setRawMaxNumberOfOperators] = useState('')

    const maxNumberOfOperators =
        rawMaxNumberOfOperators === ''
            ? undefined
            : Math.max(0, Number(setRawMaxNumberOfOperators) || 0)

    const backdropDismissable =
        streamId === streamIdProp &&
        initialAmount !== 0n &&
        dailyPayoutRate !== 0n &&
        minStakeDuration === 0 &&
        minNumberOfOperators === 1 &&
        maxNumberOfOperators !== undefined

    const extensionInDays = getSponsorshipExtensionInDays(initialAmount, dailyPayoutRate)

    const insufficientFunds = initialAmount > balance

    const invalidOperatorNumberRange =
        maxNumberOfOperators !== undefined && minNumberOfOperators > maxNumberOfOperators

    const tooLowOperatorCount =
        !MinNumberOfOperatorsParser.safeParse(minNumberOfOperators).success

    const formData: CreateSponsorshipForm = {
        streamId,
        initialAmount,
        dailyPayoutRate,
        minStakeDuration,
        minNumberOfOperators,
        maxNumberOfOperators,
    }

    const canSubmit =
        !insufficientFunds && confirmState && isValidCreateSponsorshipForm(formData)

    const invalidMinStakeDuration =
        initialAmount > 0n && dailyPayoutRate > 0n && extensionInDays < minStakeDuration

    const maxPenaltyPeriodInDays = useConfigValueFromChain(
        'maxPenaltyPeriodSeconds',
        (value) => Number(value) * DayInSeconds,
    )

    const tooLongMinStakeDuration =
        !!maxPenaltyPeriodInDays && minStakeDuration > maxPenaltyPeriodInDays

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

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
                    if (!(await checkIfStreamExists(chainId, streamId))) {
                        errorToast(
                            { title: 'Stream does not exist' },
                            streamNotFoundToaster,
                        )

                        return
                    }

                    let blockNumber = 0

                    const sponsorshipId = await createSponsorship(chainId, formData, {
                        onBlockNumber: (blockNo) => {
                            blockNumber = blockNo

                            return waitForIndexedBlock(chainId, blockNo)
                        },
                    })

                    onResolve?.({
                        sponsorshipId,
                        streamId: streamIdProp,
                        blockNumber,
                    })
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
                    <Label $wrap>Select a Stream</Label>
                    <StreamIdDropdown
                        autoFocus={!streamIdProp}
                        placeholder="Type to select a stream"
                        disabled={busy}
                        readOnly={!!streamIdProp}
                        onChange={(value) => {
                            setStreamId(value)
                        }}
                        value={streamId}
                    />
                </Section>
            </Group>
            <Group>
                <GroupHeadline>Set Sponsorship parameters</GroupHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label $wrap>Initial amount to fund</Label>
                        {insufficientFunds && <ErrorLabel>Insufficient funds</ErrorLabel>}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={insufficientFunds}>
                        <TextInput
                            name="initialAmount"
                            autoFocus={!!streamIdProp}
                            onChange={(e) => {
                                setRawInitialAmount(e.target.value)
                            }}
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            step="any"
                            value={rawInitialAmount}
                        />
                        <TextAppendix>
                            <SponsorshipPaymentTokenName />
                        </TextAppendix>
                    </FieldWrap>
                    <Hint>
                        <p>
                            Wallet balance:{' '}
                            <strong>
                                <SponsorshipDecimals
                                    abbr={limitedSpace}
                                    amount={balance}
                                    tooltip={limitedSpace}
                                />
                            </strong>
                        </p>
                    </Hint>
                </Section>
                <Section>
                    <Label $wrap>Payout rate*</Label>
                    <FieldWrap>
                        <TextInput
                            name="payoutRate"
                            onChange={(e) => {
                                setRawDailyPayoutRate(e.target.value)
                            }}
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            step="any"
                            value={rawDailyPayoutRate}
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
                        <Label $wrap>Minimum time operators must stay staked</Label>
                        <ErrorWrap>
                            {invalidMinStakeDuration && (
                                <ErrorLabel>
                                    The value is higher than the duration of the
                                    sponsorship
                                </ErrorLabel>
                            )}
                            {tooLongMinStakeDuration && (
                                <ErrorLabel>
                                    Max amount: {maxPenaltyPeriodInDays} days
                                </ErrorLabel>
                            )}
                        </ErrorWrap>
                    </WingedLabelWrap>
                    <FieldWrap
                        $invalid={invalidMinStakeDuration || tooLongMinStakeDuration}
                    >
                        <TextInput
                            name="minStakeDuration"
                            onChange={(e) => {
                                setRawMinStakeDurationInDays(e.target.value)
                            }}
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinStakeDurationInDays}
                        />
                        <TextAppendix>Days</TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label $wrap>Minimum number of operators to start payout</Label>
                    <FieldWrap
                        $invalid={invalidOperatorNumberRange || tooLowOperatorCount}
                    >
                        <TextInput
                            name="minNumberOfOperators"
                            onChange={(e) => {
                                setRawMinNumberOfOperators(e.target.value)
                            }}
                            placeholder="0"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMinNumberOfOperators}
                        />
                        <TextAppendix>
                            <span>Operators</span>
                        </TextAppendix>
                    </FieldWrap>
                </Section>
                <Section>
                    <Label $wrap>Maximum number of operators</Label>
                    <FieldWrap $invalid={invalidOperatorNumberRange}>
                        <TextInput
                            name="maxNumberOfOperators"
                            onChange={(e) => {
                                setRawMaxNumberOfOperators(e.target.value)
                            }}
                            placeholder="Leave blank if you don't want to set a limit"
                            readOnly={busy}
                            type="number"
                            min={0}
                            value={rawMaxNumberOfOperators}
                        />
                        <TextAppendix>Operators</TextAppendix>
                    </FieldWrap>
                </Section>
            </Group>
            <SponsorshipDisclaimer
                checkboxState={confirmState}
                onCheckboxStateChange={(value) => setConfirmState(value)}
            />
        </FormModal>
    )
}

export const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)
