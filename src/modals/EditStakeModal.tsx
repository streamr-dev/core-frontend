import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import moment from 'moment'
import { RejectionReason, isRejectionReason } from '~/modals/BaseModal'
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
import Label from '~/shared/components/Ui/Label'
import { BN, toBN } from '~/utils/bn'
import { fromDecimals, toDecimals } from '~/marketplace/utils/math'
import { Alert } from '~/components/Alert'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { isTransactionRejection, sameBN, waitForIndexedBlock } from '~/utils'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { getSponsorshipStakeForOperator } from '~/utils/sponsorships'
import {
    forceUnstakeFromSponsorship,
    reduceStakeOnSponsorship,
    stakeOnSponsorship,
} from '~/services/sponsorships'
import { confirm } from '~/getters/confirm'
import { Layer } from '~/utils/Layer'
import { Abbr } from '~/components/Abbr'

interface Props extends Pick<FormModalProps, 'onReject'> {
    leavePenaltyWei: BN
    onResolve?: () => void
    operator: ParsedOperator
    sponsorship: ParsedSponsorship
}

const DefaultCurrentAmount = toBN(0)

function EditStakeModal({
    leavePenaltyWei,
    onResolve,
    onReject,
    operator: { dataTokenBalanceWei: operatorBalance, id: operatorId, queueEntries },
    sponsorship: { id: sponsorshipId, stakes, minimumStakingPeriodSeconds },
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const { decimals = 18 } = useSponsorshipTokenInfo() || {}

    const stake = useMemo(
        () => getSponsorshipStakeForOperator(stakes, operatorId),
        [stakes, operatorId],
    )

    useEffect(() => {
        if (!stake) {
            onReject?.(new Error('Cannot edit. Operator has no stake in sponsorship.'))
        }
    }, [stake, onReject])

    const globalMinimumStakeWei = toBN(useConfigValueFromChain('minimumStakeWei') || 0)

    const minimumStakeWei = BN.max(globalMinimumStakeWei, stake?.lockedWei || 0)

    const { joinTimestamp = 0, amount: currentAmount = DefaultCurrentAmount } =
        stake || {}

    const [rawAmount, setRawAmount] = useState(currentAmount.toString())

    useEffect(() => {
        setRawAmount(currentAmount.toString())
    }, [currentAmount])

    const minLeaveDate = moment(joinTimestamp + minimumStakingPeriodSeconds, 'X').format(
        'YYYY-MM-DD HH:mm',
    )

    const hasUndelegationQueue = queueEntries.length > 0

    const amount = toDecimals(rawAmount || '0', decimals)

    const finalAmount =
        amount.isFinite() && amount.isGreaterThanOrEqualTo(0) ? amount : toBN(0)

    const difference = finalAmount.minus(toDecimals(currentAmount, decimals))

    const insufficientFunds = difference.isGreaterThan(0)
        ? difference.isGreaterThan(operatorBalance)
        : false

    const isFinalAmountWithinAcceptedRange =
        finalAmount.isEqualTo(0) || finalAmount.isGreaterThanOrEqualTo(minimumStakeWei)

    const canSubmit =
        isFinalAmountWithinAcceptedRange &&
        !insufficientFunds &&
        !difference.isEqualTo(0) &&
        (difference.isGreaterThan(0) ? !hasUndelegationQueue : true)

    let submitLabel = 'Save'

    if (finalAmount.isEqualTo(0)) {
        submitLabel = 'Unstake'
    }
    if (difference.isGreaterThan(0)) {
        submitLabel = 'Increase stake'
    }
    if (difference.isLessThan(0) && !finalAmount.isEqualTo(0)) {
        submitLabel = 'Reduce stake'
    }

    const leavePenalty = fromDecimals(leavePenaltyWei, decimals)

    const lockedStake = fromDecimals(stake?.lockedWei || 0, decimals)

    const slashingAmount = finalAmount.isGreaterThan(0)
        ? toBN(0)
        : leavePenalty.plus(lockedStake)

    const dirty = sameBN(rawAmount || '0', currentAmount)

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

    const diff = fromDecimals(difference, decimals)

    const availableBalance = fromDecimals(operatorBalance, decimals)

    return (
        <FormModal
            {...props}
            title="Edit stake"
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (reason !== RejectionReason.Backdrop || !dirty)
            }
            onReject={onReject}
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    if (difference.isGreaterThanOrEqualTo(0)) {
                        await stakeOnSponsorship(
                            sponsorshipId,
                            difference.toString(),
                            operatorId,
                            {
                                toastLabel: 'Increase stake on sponsorship',
                                onBlockNumber: waitForIndexedBlock,
                            },
                        )

                        return void onResolve?.()
                    }

                    if (slashingAmount.isZero()) {
                        await reduceStakeOnSponsorship(
                            sponsorshipId,
                            finalAmount.toString(),
                            operatorId,
                            {
                                onBlockNumber: waitForIndexedBlock,
                                toastLabel: finalAmount.isZero()
                                    ? 'Unstake from sponsorship'
                                    : 'Reduce stake on sponsorship',
                            },
                        )

                        return void onResolve?.()
                    }

                    const slashingReason =
                        leavePenalty.isGreaterThan(0) && lockedStake.isGreaterThan(0) ? (
                            <>
                                Your minimum staking period is still ongoing and ends on{' '}
                                {minLeaveDate}, and additionally some of your stake is
                                locked in the Sponsorship due to open flags.
                            </>
                        ) : leavePenalty.isGreaterThan(0) ? (
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
                                    {slashingAmount.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            ),
                            proceedLabel: 'Proceed anyway',
                            cancelLabel: 'Cancel',
                        })
                    ) {
                        await forceUnstakeFromSponsorship(sponsorshipId, operatorId, {
                            onBlockNumber: waitForIndexedBlock,
                        })

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
                    {rawAmount !== '' && !isFinalAmountWithinAcceptedRange && (
                        <ErrorLabel>
                            Minimum value is{' '}
                            {fromDecimals(minimumStakeWei, decimals).toString()}{' '}
                            <SponsorshipPaymentTokenName />
                        </ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap
                    $invalid={rawAmount !== '' && !isFinalAmountWithinAcceptedRange}
                >
                    <TextInput
                        autoFocus
                        name="amount"
                        onChange={({ target }) => void setRawAmount(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <MaxButton
                        onClick={() => {
                            setRawAmount(availableBalance.plus(currentAmount).toString())
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
                            {limitedSpace ? (
                                <Abbr>{currentAmount}</Abbr>
                            ) : (
                                <>
                                    {currentAmount.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Stake change</Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{diff}</Abbr>
                            ) : (
                                <>
                                    {diff.toString()} <SponsorshipPaymentTokenName />
                                </>
                            )}
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
                            {limitedSpace ? (
                                <Abbr>{availableBalance}</Abbr>
                            ) : (
                                <>
                                    {availableBalance.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            {finalAmount.isEqualTo(0) && leavePenalty.isGreaterThan(0) && (
                <StyledAlert type="error" title="Your stake will be slashed">
                    Your minimum staking period is still ongoing and ends on{' '}
                    {minLeaveDate}. If you unstake now, you will lose{' '}
                    {leavePenalty.toString()} <SponsorshipPaymentTokenName />.
                </StyledAlert>
            )}
            {difference.isGreaterThan(0) && hasUndelegationQueue && (
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
