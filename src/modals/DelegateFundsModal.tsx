import React, { useEffect, useState } from 'react'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    FieldWrap,
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import { BN, toBN } from '~/utils/bn'
import { toDecimals } from '~/marketplace/utils/math'
import styled from 'styled-components'
import { Alert } from '~/components/Alert'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (amount: string) => void
    onSubmit: (amount: BN) => Promise<void>
    balance?: string
    tokenSymbol: string
    decimals: number
    delegatedTotal?: string
    operatorId?: string
    amount?: string
    tooLowOwnerSelfDelegation: boolean
    isCurrentUserOwner: boolean
}

export default function DelegateFundsModal({
    title = 'Delegate',
    balance: balanceProp = '0',
    tokenSymbol,
    decimals,
    delegatedTotal: delegatedTotalProp = '0',
    operatorId = 'N/A',
    onResolve,
    onSubmit,
    amount: amountProp = '',
    submitLabel = 'Delegate',
    tooLowOwnerSelfDelegation,
    isCurrentUserOwner,
    ...props
}: Props) {
    const [rawAmount, setRawAmount] = useState(amountProp)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = toBN(value)

    const balance = toBN(balanceProp)

    const delegatedTotal = toBN(delegatedTotalProp)

    const insufficientFunds = finalValue.isGreaterThan(balance)

    const canSubmit =
        finalValue.isFinite() &&
        finalValue.isGreaterThan(0) &&
        !insufficientFunds &&
        (isCurrentUserOwner ? true : !tooLowOwnerSelfDelegation)

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
                    await onSubmit(toDecimals(finalValue, decimals))

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
                            {balance.toString()} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                    <li>
                        <Prop>Amount currently delegated to Operator</Prop>
                        <div>
                            {delegatedTotal.toString()} {tokenSymbol}
                        </div>
                    </li>
                </ul>
            </Section>
            {!isCurrentUserOwner && tooLowOwnerSelfDelegation ? (
                <StyledAlert type="error" title="Too low self-delegation">
                    Cannot delegate funds to the operator because it&apos;s owner has a
                    too low self-delegation percentage
                </StyledAlert>
            ) : (
                <></>
            )}
        </FormModal>
    )
}

const StyledAlert = styled(Alert)`
    margin-top: 10px;
`
