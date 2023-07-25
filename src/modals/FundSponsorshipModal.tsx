import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui//Label'
import { toBN } from '~/utils/bn'
import { FieldWrap, TextAppendix, TextInput } from '~/components/TextInput'

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (amount: string) => void
    balance?: string
    tokenSymbol?: string
    delegatedTotal?: string
    operatorId?: string
    amount?: string
    pricePerSecond?: string
}

const DayInSeconds = 60 * 60 * 24

export default function FundSponsorshipModal({
    title = 'Fund Sponsorship',
    balance: balanceProp = '0',
    tokenSymbol = 'DATA',
    onResolve,
    amount: amountProp = '',
    submitLabel = 'Fund',
    pricePerSecond: pricePerSecondProp = '0',
    ...props
}: Props) {
    const [rawAmount, setRawAmount] = useState(amountProp)

    const pricePerSecond = toBN(pricePerSecondProp)

    const rate = pricePerSecond.dividedBy(1e18).multipliedBy(DayInSeconds)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = toBN(value).multipliedBy(1e18)

    const extensionInSeconds =
        pricePerSecond.isGreaterThan(0) && finalValue.isGreaterThanOrEqualTo(0)
            ? finalValue.dividedBy(pricePerSecond).toNumber()
            : 0

    const endDate = new Date(Date.now() + extensionInSeconds * 1000)

    const balance = toBN(balanceProp)

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
                    console.warn('Error while funding sponsorship', e)
                    setBusy(false)
                } finally {
                    /**
                     * No need to reset `busy`. `onResolve` makes the whole modal disappear.
                     */
                }
            }}
        >
            <SectionHeadline>
                Please set the amount of {tokenSymbol} to spend to extend the Sponsorship
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
                        <Prop>Sponsorship extended by</Prop>
                        <div>{extensionInSeconds / DayInSeconds} days</div>
                    </li>
                    <li>
                        <Prop>New end date</Prop>
                        <div>{moment(endDate).format('YYYY-MM-DD')}</div>
                    </li>
                    <li>
                        <Prop>Rate</Prop>
                        <div>
                            {rate.toString()} {tokenSymbol}/day
                        </div>
                    </li>
                </ul>
            </Section>
        </FormModal>
    )
}
