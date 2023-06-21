import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { RejectionReason } from '$app/src/modals/BaseModal'
import FormModal, {
    FieldWrap,
    FormModalProps,
    Hint,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
} from '$app/src/modals/FormModal'
import Label from '$ui/Label'

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (amount: string) => void
    balance?: string
    tokenSymbol?: string
    delegatedTotal?: string
    operatorId?: string
    amount?: string
}

export default function DelegateFundsModal({
    title = 'Delegate',
    balance: balanceProp = '0',
    tokenSymbol = 'DATA',
    delegatedTotal: delegatedTotalProp = '0',
    operatorId = 'N/A',
    onResolve,
    amount: amountProp = '',
    submitLabel = 'Delegate',
    ...props
}: Props) {
    const [rawAmount, setRawAmount] = useState(amountProp)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = new BigNumber(value).multipliedBy(1e18)

    const balance = new BigNumber(balanceProp)

    const delegatedTotal = new BigNumber(delegatedTotalProp)

    const insufficientFunds = finalValue.isGreaterThan(balance)

    const canSubmit =
        finalValue.isFinite() && finalValue.isGreaterThan(0) && !insufficientFunds

    const [busy, setBusy] = useState(false)

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitting={busy}
            submitLabel={submitLabel}
            onBeforeAbort={(reason) =>
                !busy && (rawAmount === amountProp || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    await new Promise((resolve) => void setTimeout(resolve, 2000))

                    onResolve?.(finalValue.toString())
                } catch (e) {
                    console.warn('Error while delegating funds', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <SectionHeadline>
                Please set the amount of {tokenSymbol} to delegate to the selected
                Operator
            </SectionHeadline>
            <Section>
                <Label>Amount to delegate</Label>
                <FieldWrap $invalid={insufficientFunds}>
                    <TextInput
                        name="amount"
                        autoFocus
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
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in your wallet</>
                            ) : (
                                <>Your wallet balance</>
                            )}
                        </Prop>
                        <div>
                            {balance.dividedBy(1e18).toString()} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                    <li>
                        <Prop>Amount currently delegated to Operator</Prop>
                        <div>
                            {delegatedTotal.dividedBy(1e18).toString()} {tokenSymbol}
                        </div>
                    </li>
                </ul>
            </Section>
        </FormModal>
    )
}
