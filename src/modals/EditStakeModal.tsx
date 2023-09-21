import React, { useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import { toBN } from '~/utils/bn'
import { fromDecimals, toDecimals } from '~/marketplace/utils/math'
import { useConfigFromChain } from '~/hooks/useConfigFromChain'
import { Alert } from '~/components/Alert'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onSubmit: (amountWei: string, differenceWei: string, forceUnstake?: boolean) => void
    onResolve?: (result: { amountWei: string; differenceWei: string }) => void
    operatorBalance: string
    tokenSymbol: string
    decimals: number
    operatorId: string
    currentStake: string
    leavePenalty: string
    minLeaveDate: string
    hasUndelegationQueue: boolean
}

export default function EditStakeModal({
    title = 'Edit stake',
    onResolve,
    onSubmit,
    operatorBalance: operatorBalanceProp,
    operatorId = 'N/A',
    tokenSymbol = 'DATA',
    currentStake: currentStakeProp,
    decimals = 18,
    leavePenalty: leavePenaltyWei,
    minLeaveDate,
    hasUndelegationQueue,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const operatorBalance = toBN(operatorBalanceProp)

    const [rawAmount, setRawAmount] = useState(currentStakeProp)

    const amount = toDecimals(rawAmount || '0', decimals)

    const finalAmount =
        amount.isFinite() && amount.isGreaterThanOrEqualTo(0) ? amount : toBN(0)

    const insufficientFunds = finalAmount.isGreaterThan(operatorBalance)

    const difference = finalAmount.minus(toDecimals(currentStakeProp, decimals))

    const { minimumStakeWei } = useConfigFromChain()
    const isZeroOrAboveMinimumStake =
        finalAmount.isEqualTo(0) ||
        (minimumStakeWei ? finalAmount.isGreaterThan(toBN(minimumStakeWei)) : true)

    const canSubmit =
        finalAmount.isGreaterThanOrEqualTo(0) &&
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

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy &&
                (toBN(rawAmount || '0')
                    .multipliedBy(Math.pow(10, decimals))
                    .eq(currentStakeProp || '0') ||
                    reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await onSubmit(
                        finalAmount.toString(),
                        difference.toString(),
                        finalAmount.isEqualTo(0) && leavePenalty.isGreaterThan(0),
                    )
                    onResolve?.({
                        amountWei: finalAmount.toString(),
                        differenceWei: difference.toString(),
                    })
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
            <SectionHeadline>
                Please set the amount of {tokenSymbol} to stake on the selected
                Sponsorship
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label>Amount to stake</Label>
                    {rawAmount !== '' && !isZeroOrAboveMinimumStake && (
                        <ErrorLabel>
                            Minimum value is{' '}
                            {fromDecimals(minimumStakeWei || 0, decimals).toString()}{' '}
                            {tokenSymbol}
                        </ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={rawAmount !== '' && !isZeroOrAboveMinimumStake}>
                    <TextInput
                        autoFocus
                        name="amount"
                        onChange={({ target }) => void setRawAmount(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        value={rawAmount}
                    />
                    <TextAppendix>{tokenSymbol}</TextAppendix>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop>Current stake</Prop>
                        <div>
                            {currentStakeProp} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Stake change</Prop>
                        <div>
                            {fromDecimals(difference, decimals).toString()} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator contract</>
                            ) : (
                                <>Available balance in Operator contract</>
                            )}
                        </Prop>
                        <div>
                            {fromDecimals(operatorBalance, decimals).toString()}{' '}
                            {tokenSymbol}
                        </div>
                    </li>
                </ul>
            </Section>
            {finalAmount.isEqualTo(0) && leavePenalty.isGreaterThan(0) && (
                <StyledAlert type="error" title="Your stake will be slashed">
                    Your minimum staking period is still ongoing and ends on{' '}
                    {minLeaveDate}. If you unstake now, you will lose{' '}
                    {leavePenalty.toString()} {tokenSymbol}.
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

const StyledAlert = styled(Alert)`
    margin-top: 16px;
`
