import React, { useState } from 'react'
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

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onSubmit: (amountWei: string, differenceWei: string) => void
    onResolve?: (amountWei: string, differenceWei: string) => void
    operatorBalance: string
    tokenSymbol: string
    decimals: number
    operatorId: string
    currentStake: string
}

export default function EditStakeModal({
    title = 'Edit stake',
    submitLabel = 'Save',
    onResolve,
    onSubmit,
    operatorBalance: operatorBalanceProp,
    operatorId = 'N/A',
    tokenSymbol = 'DATA',
    currentStake: currentStakeProp,
    decimals = 18,
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
        /*!liveNodesCountLoading &&
        liveNodesCount > 0 &&*/
        !difference.isEqualTo(0)

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
                    await onSubmit(finalAmount.toString(), difference.toString())
                    onResolve?.(finalAmount.toString(), difference.toString())
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
                            {fromDecimals(minimumStakeWei, decimals).toString()}{' '}
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
                            {fromDecimals(currentStakeProp, decimals).toString()}{' '}
                            {tokenSymbol}
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
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                </ul>
            </Section>
        </FormModal>
    )
}
