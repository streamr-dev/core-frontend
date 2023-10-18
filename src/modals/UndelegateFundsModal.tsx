import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert } from '~/components/Alert'
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
import { COLORS } from '~/shared/utils/styled'
import { BN, toBN } from '~/utils/bn'
import { toDecimals } from '~/marketplace/utils/math'
import { useMaxUndelegationQueueDays } from '~/hooks'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (amount: string) => void
    onSubmit: (amount: BN) => Promise<void>
    balance?: string
    tokenSymbol: string
    decimals: number
    delegatedTotal?: string
    operatorId?: string
    isCurrentUserOwner?: boolean
    amount?: string
    freeFunds?: string
    minimumSelfDelegation?: string
}

export default function UndelegateFundsModal({
    title = 'Undelegate',
    balance: balanceProp = '0',
    tokenSymbol,
    decimals,
    delegatedTotal: delegatedTotalProp = '0',
    freeFunds: freeFundsProp = '0',
    minimumSelfDelegation: minimumSelfDelegationProp = '0',
    operatorId = 'N/A',
    isCurrentUserOwner = false,
    onResolve,
    onSubmit,
    amount: amountProp = '',
    submitLabel = 'Undelegate',
    ...props
}: Props) {
    const [rawAmount, setRawAmount] = useState(amountProp)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const maxUndelegationQueueDays = useMaxUndelegationQueueDays()

    const value = rawAmount || '0'

    const finalValue = toBN(value)

    const balance = toBN(balanceProp)

    const delegatedTotal = toBN(delegatedTotalProp)

    const freeFunds = toBN(freeFundsProp)

    const minimumSelfDelegation = toBN(minimumSelfDelegationProp)

    const hasDelegatedTooLittle =
        minimumSelfDelegation != null &&
        isCurrentUserOwner &&
        minimumSelfDelegation.isGreaterThan(0) &&
        delegatedTotal.minus(toBN(rawAmount)).isLessThan(minimumSelfDelegation)

    const canSubmit =
        finalValue.isFinite() && finalValue.isGreaterThan(0) && !hasDelegatedTooLittle

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
                    console.warn('Error while undelegating funds', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <SectionHeadline>
                Please set the amount of {tokenSymbol} to undelegate to the selected
                Operator
            </SectionHeadline>
            <Section>
                <Label>Amount to undelegate</Label>
                <FieldWrap $top={true}>
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
                <FieldWrap $bottom={true} $padded={true}>
                    <Prop>
                        Amount currently delegated to Operator:{' '}
                        {delegatedTotal.toString()} {tokenSymbol}
                    </Prop>
                    <LinkButton onClick={() => setRawAmount(delegatedTotal.toString())}>
                        Max
                    </LinkButton>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop>Your wallet balance</Prop>
                        <div>
                            {balance.toString()} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                    <li>
                        <Prop>Available balance in operator contract</Prop>
                        <div>
                            {freeFunds.toString()} {tokenSymbol}
                        </div>
                    </li>
                </ul>
            </Section>
            <Footer>
                {toBN(rawAmount).isGreaterThan(0) &&
                    toBN(rawAmount).isLessThanOrEqualTo(freeFunds) && (
                        <Alert
                            type="notice"
                            title={`${rawAmount.toString()} ${tokenSymbol} will be undelegated immediately`}
                        />
                    )}
                {toBN(rawAmount).isGreaterThan(freeFunds) && (
                    <Alert type="notice" title="Undelegation will be queued">
                        Your undelegation will be queued for a maximum of{' '}
                        {maxUndelegationQueueDays.toNumber().toFixed(0)} days, after which
                        you will be able to force undelegation.
                    </Alert>
                )}
                {hasDelegatedTooLittle && (
                    <Alert type="error" title="Self delegation too low">
                        You must have self delegated at least{' '}
                        {minimumSelfDelegation.toString()} ${tokenSymbol}.
                    </Alert>
                )}
            </Footer>
        </FormModal>
    )
}

const LinkButton = styled.a`
    cursor: pointer;
    color: ${COLORS.link};
`

const Footer = styled.div`
    display: grid;
    gap: 8px;
    margin-top: 8px;
`
