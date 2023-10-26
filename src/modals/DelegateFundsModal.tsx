import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
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
import { fromDecimals, toDecimals } from '~/marketplace/utils/math'
import { Alert } from '~/components/Alert'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getSelfDelegatedAmount, getSelfDelegationFraction } from '~/getters'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { useConfigValueFromChain } from '~/hooks'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (amount: string) => void
    onSubmit: (amount: BN) => Promise<void>
    balance?: string
    tokenSymbol: string
    decimals: number
    delegatedTotal?: string
    amount?: string
    operator: ParsedOperator
}

export default function DelegateFundsModal({
    title = 'Delegate',
    balance: balanceProp = '0',
    tokenSymbol,
    decimals,
    delegatedTotal: delegatedTotalProp = '0',
    onResolve,
    onSubmit,
    amount: amountProp = '',
    submitLabel = 'Delegate',
    operator,
    ...props
}: Props) {
    const walletAddress = useWalletAccount()

    const minimumSelfDelegationFraction = useConfigValueFromChain(
        'minimumSelfDelegationFraction',
    )
    const minimumSelfDelegation = minimumSelfDelegationFraction
        ? fromDecimals(minimumSelfDelegationFraction, 18)
        : toBN(0)

    const [rawAmount, setRawAmount] = useState(amountProp)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = toBN(value)

    const finalValueDecimals = toDecimals(finalValue, decimals)

    const balance = toBN(balanceProp)

    const delegatedTotal = toBN(delegatedTotalProp)

    const insufficientFunds = finalValue.isGreaterThan(balance)

    const tooLowCurrentSelfDelegation = useMemo<boolean>(() => {
        if (operator.owner === walletAddress) {
            return false
        }
        const percentage = getSelfDelegationFraction(operator)
        return percentage.isLessThan(minimumSelfDelegation)
    }, [operator, minimumSelfDelegation, walletAddress])

    const tooLowSelfDelegationWithNewAmount = useMemo(() => {
        if (operator.owner === walletAddress) {
            return false
        }
        const percentage = getSelfDelegationFraction(operator, {
            offset: finalValueDecimals,
        })
        return percentage.isLessThan(minimumSelfDelegation)
    }, [operator, minimumSelfDelegation, walletAddress, finalValueDecimals])

    const tooLowOwnerSelfDelegation =
        tooLowCurrentSelfDelegation || tooLowSelfDelegationWithNewAmount

    const maxAmount = useMemo<BN>(() => {
        if (minimumSelfDelegation.isZero()) {
            return toBN(0)
        }
        const operatorSelfStake = getSelfDelegatedAmount(operator)
        return fromDecimals(
            operatorSelfStake.dividedBy(minimumSelfDelegation).minus(operatorSelfStake),
            decimals,
        )
    }, [operator, minimumSelfDelegation, decimals])

    const canSubmit =
        finalValue.isFinite() &&
        finalValue.isGreaterThan(0) &&
        !insufficientFunds &&
        !tooLowOwnerSelfDelegation

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
                        <Prop>Operator</Prop>
                        <div>{operator.id}</div>
                    </li>
                    <li>
                        <Prop>Your stake</Prop>
                        <div>
                            {delegatedTotal.toString()} {tokenSymbol}
                        </div>
                    </li>
                </ul>
            </Section>
            {tooLowCurrentSelfDelegation ? (
                <StyledAlert type="error" title="Unable to delegate">
                    This operator can not accept any further delegations at the moment,
                    because the operator’s own share of funds is below the required limit.
                </StyledAlert>
            ) : (
                <></>
            )}
            {!tooLowCurrentSelfDelegation && tooLowSelfDelegationWithNewAmount ? (
                <StyledAlert type="error" title="Amount too high">
                    This operator can currently only accept{' '}
                    <strong>
                        {maxAmount.toString()} {tokenSymbol}
                    </strong>{' '}
                    in further delegations, because operators must stay above a certain
                    proportion of their own funds vs. delegations.
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
