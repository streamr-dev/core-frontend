import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
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
import { toBN } from '~/utils/bn'
import { pluralizeUnit } from '~/utils/pluralizeUnit'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (amount: string) => void
    onSubmit: (amount: string) => Promise<void>
    balance: string
    tokenSymbol: string
    decimals: number
    amount?: string
    payoutPerDay: string
}

const DayInSeconds = 60 * 60 * 24

export default function FundSponsorshipModal({
    title = 'Fund Sponsorship',
    balance: balanceProp,
    tokenSymbol,
    decimals: decimalsProp,
    onResolve,
    onSubmit,
    amount: amountProp = '',
    submitLabel = 'Fund',
    payoutPerDay = '0',
    ...props
}: Props) {
    const [rawAmount, setRawAmount] = useState(amountProp)
    const decimals = Math.pow(10, decimalsProp)

    const pricePerSecond = toBN(payoutPerDay)
        .multipliedBy(decimals)
        .dividedBy(DayInSeconds)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = toBN(value).multipliedBy(decimals)

    const extensionInSeconds =
        pricePerSecond.isGreaterThan(0) && finalValue.isGreaterThanOrEqualTo(0)
            ? finalValue.dividedBy(pricePerSecond).toNumber()
            : 0

    const extensionDuration = moment.duration(extensionInSeconds, 'seconds')
    const extensionText = useMemo<string>(() => {
        if (extensionDuration.asSeconds() === 0) {
            return '0 days'
        }

        const years = extensionDuration.get('years')
        const months = extensionDuration.get('months')
        const days = extensionDuration.get('days')
        const hours = extensionDuration.get('hours')
        const minutes = extensionDuration.get('minutes')

        if (!years && !months && !days && !hours) {
            return `${minutes} ${pluralizeUnit(minutes, 'minute')}`
        }

        if (!years && !months && !days) {
            return (
                `${hours} ${pluralizeUnit(hours, 'hour')}` +
                (minutes ? ` & ${minutes} ${pluralizeUnit(minutes, 'minute')}` : '')
            )
        }

        if (!years && !months) {
            return `${days} ${pluralizeUnit(days, 'day')} & ${hours} ${pluralizeUnit(
                hours,
                'hour',
            )}`
        }

        if (!years) {
            return `${months} ${pluralizeUnit(months, 'month')} & ${days} ${pluralizeUnit(
                days,
                'day',
            )}`
        }

        return `${years} ${pluralizeUnit(years, 'year')}, ${months} ${pluralizeUnit(
            months,
            'month',
        )} & ${days} ${pluralizeUnit(days, 'day')}`
    }, [extensionDuration])

    const endDate = new Date(Date.now() + extensionInSeconds * 1000)

    const insufficientFunds = finalValue.isGreaterThan(
        toBN(balanceProp).multipliedBy(decimals),
    )

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
                    await onSubmit(finalValue.toString())

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
                <Label>Amount to sponsor</Label>
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
                            {balanceProp} {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Sponsorship extended by</Prop>
                        <div>{extensionText}</div>
                    </li>
                    <li>
                        <Prop>New end date</Prop>
                        <div>{moment(endDate).format('YYYY-MM-DD')}</div>
                    </li>
                    <li>
                        <Prop>Rate</Prop>
                        <div>
                            {payoutPerDay} {tokenSymbol}/day
                        </div>
                    </li>
                </ul>
            </Section>
        </FormModal>
    )
}
