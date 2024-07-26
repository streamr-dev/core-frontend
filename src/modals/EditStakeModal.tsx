import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Alert } from '~/components/Alert'
import { SponsorshipDecimals } from '~/components/Decimals'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { confirm } from '~/getters/confirm'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import FormModal, {
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    MaxButton,
    Prop,
    PropList,
    PropValue,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    forceUnstakeFromSponsorship,
    reduceStakeOnSponsorship,
    stakeOnSponsorship,
} from '~/services/sponsorships'
import Label from '~/shared/components/Ui/Label'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { toBigInt, toFloat } from '~/utils/bn'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
import { getSponsorshipStakeForOperator } from '~/utils/sponsorships'

interface Props extends Pick<FormModalProps, 'onReject'> {
    chainId: number
    leavePenalty: bigint
    onResolve?: () => void
    operator: ParsedOperator
    sponsorship: ParsedSponsorship
}

function EditStakeModal({
    chainId,
    leavePenalty,
    onResolve,
    onReject,
    operator: { dataTokenBalanceWei: availableBalance, id: operatorId, queueEntries },
    sponsorship: { id: sponsorshipId, stakes, minimumStakingPeriodSeconds },
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    const stake = useMemo(
        () => getSponsorshipStakeForOperator(stakes, operatorId),
        [stakes, operatorId],
    )

    const lockedStake = stake?.lockedWei || 0n

    useEffect(() => {
        if (!stake) {
            onReject?.(new Error('Cannot edit. Operator has no stake in sponsorship.'))
        }
    }, [stake, onReject])

    const globalMinimumStakeWei = useConfigValueFromChain('minimumStakeWei') || 0n

    const minimumStakeWei = ((a: bigint, b: bigint) => (a > b ? a : b))(
        globalMinimumStakeWei,
        lockedStake,
    )

    const { joinTimestamp = 0, amountWei: currentAmount = 0n } = stake || {}

    const [rawAmount, setRawAmount] = useState(
        toFloat(currentAmount, decimals).toString(),
    )

    useEffect(() => {
        setRawAmount(toFloat(currentAmount, decimals).toString())
    }, [currentAmount, decimals])

    const minLeaveDate = moment(joinTimestamp + minimumStakingPeriodSeconds, 'X').format(
        'YYYY-MM-DD HH:mm',
    )

    const hasUndelegationQueue = queueEntries.length > 0

    const amount = ((a: bigint) => (a > 0n ? a : 0n))(toBigInt(rawAmount || 0, decimals))

    const difference = amount - currentAmount

    const insufficientFunds = difference > 0n && difference > availableBalance

    const isAmountWithinAcceptedRange = amount === 0n || amount >= minimumStakeWei

    const canSubmit =
        isAmountWithinAcceptedRange &&
        !insufficientFunds &&
        difference !== 0n &&
        (difference > 0n ? !hasUndelegationQueue : true)

    let submitLabel = 'Save'

    if (amount === 0n) {
        submitLabel = 'Unstake'
    }

    if (difference > 0n) {
        submitLabel = 'Increase stake'
    }

    if (difference < 0n && amount !== 0n) {
        submitLabel = 'Reduce stake'
    }

    const slashingAmount = amount > 0n ? 0n : leavePenalty + lockedStake

    const clean = amount === currentAmount

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

    return (
        <FormModal
            {...props}
            title="Edit stake"
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (reason !== RejectionReason.Backdrop || clean)
            }
            onReject={onReject}
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    if (difference >= 0n) {
                        await stakeOnSponsorship(
                            chainId,
                            sponsorshipId,
                            difference,
                            operatorId,
                            {
                                toastLabel: 'Increase stake on sponsorship',
                                onReceipt: ({ blockNumber }) =>
                                    waitForIndexedBlock(chainId, blockNumber),
                            },
                        )

                        return void onResolve?.()
                    }

                    if (slashingAmount === 0n) {
                        await reduceStakeOnSponsorship(
                            chainId,
                            sponsorshipId,
                            amount,
                            operatorId,
                            {
                                onReceipt: ({ blockNumber }) =>
                                    waitForIndexedBlock(chainId, blockNumber),
                                toastLabel:
                                    amount === 0n
                                        ? 'Unstake from sponsorship'
                                        : 'Reduce stake on sponsorship',
                            },
                        )

                        return void onResolve?.()
                    }

                    const slashingReason =
                        leavePenalty > 0n && lockedStake > 0n ? (
                            <>
                                Your minimum staking period is still ongoing and ends on{' '}
                                {minLeaveDate}, and additionally some of your stake is
                                locked in the Sponsorship due to open flags.
                            </>
                        ) : leavePenalty > 0n ? (
                            <>
                                Your minimum staking period is still ongoing and ends on{' '}
                                {minLeaveDate}.
                            </>
                        ) : (
                            <>
                                Some of your stake is locked in the Sponsorship due to
                                open flags.
                            </>
                        )

                    if (
                        await confirm({
                            title: 'Your stake will be slashed',
                            description: (
                                <>
                                    {slashingReason} If you unstake now, you will lose{' '}
                                    <SponsorshipDecimals amount={slashingAmount} />
                                </>
                            ),
                            proceedLabel: 'Proceed anyway',
                            cancelLabel: 'Cancel',
                            isDangerous: true,
                        })
                    ) {
                        await forceUnstakeFromSponsorship(
                            chainId,
                            sponsorshipId,
                            operatorId,
                            {
                                onReceipt: ({ blockNumber }) =>
                                    waitForIndexedBlock(chainId, blockNumber),
                            },
                        )

                        onResolve?.()
                    }
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
            <SectionHeadline>
                Please set the amount of <SponsorshipPaymentTokenName /> to stake on the
                selected Sponsorship
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label $wrap>Amount to stake</Label>
                    {rawAmount !== '' && !isAmountWithinAcceptedRange && (
                        <ErrorLabel>
                            Minimum value is{' '}
                            <SponsorshipDecimals amount={minimumStakeWei} />
                        </ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={rawAmount !== '' && !isAmountWithinAcceptedRange}>
                    <TextInput
                        autoFocus
                        name="amount"
                        onChange={(e) => {
                            setRawAmount(e.target.value)
                        }}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <MaxButton
                        onClick={() => {
                            setRawAmount(
                                toFloat(
                                    availableBalance + currentAmount,
                                    decimals,
                                ).toString(),
                            )
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop>Current stake</Prop>
                        <PropValue>
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={currentAmount}
                                tooltip={limitedSpace}
                            />
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Stake change</Prop>
                        <PropValue>
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={difference}
                                tooltip={limitedSpace}
                            />
                        </PropValue>
                    </li>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator</>
                            ) : (
                                <>Available balance in Operator</>
                            )}
                        </Prop>
                        <PropValue>
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={availableBalance}
                                tooltip={limitedSpace}
                            />
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            {amount === 0n && leavePenalty > 0n && (
                <StyledAlert type="error" title="Your stake will be slashed">
                    Your minimum staking period is still ongoing and ends on{' '}
                    {minLeaveDate}. If you unstake now, you will lose{' '}
                    <SponsorshipDecimals amount={leavePenalty} />.
                </StyledAlert>
            )}
            {difference > 0n && hasUndelegationQueue && (
                <StyledAlert type="error" title="Warning!">
                    Cannot stake on sponsorship while delegators are awaiting undelegation
                </StyledAlert>
            )}
        </FormModal>
    )
}

export const editStakeModal = toaster(EditStakeModal, Layer.Modal)

const StyledAlert = styled(Alert)`
    margin-top: 16px;
`
