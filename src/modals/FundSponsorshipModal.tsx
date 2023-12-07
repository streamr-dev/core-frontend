import React, { useMemo, useState } from 'react'
import moment from 'moment'
import { toaster } from 'toasterhea'
import { RejectionReason, isRejectionReason } from '~/modals/BaseModal'
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
import { BN } from '~/utils/bn'
import { pluralizeUnit } from '~/utils/pluralizeUnit'
import { Layer } from '~/utils/Layer'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { toDecimals } from '~/marketplace/utils/math'
import { fundSponsorship } from '~/services/sponsorships'
import { isTransactionRejection, waitForIndexedBlock } from '~/utils'
import { SponsorshipDisclaimer } from '~/components/SponsorshipDisclaimer'

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: BN
    onResolve?: () => void
    sponsorship: ParsedSponsorship
}

const DayInSeconds = 60 * 60 * 24

function FundSponsorshipModal({ balance, onResolve, sponsorship, ...props }: Props) {
    const { decimals = 18 } = useSponsorshipTokenInfo() || {}

    const [rawAmount, setRawAmount] = useState('')
    const [confirmState, setConfirmState] = useState(false)

    const pricePerSecond = toDecimals(sponsorship.payoutPerDay, decimals).dividedBy(
        DayInSeconds,
    )

    const value = rawAmount || '0'

    const finalValue = toDecimals(value, decimals)

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

    const startDate =
        sponsorship.projectedInsolvencyAt == null
            ? Date.now()
            : sponsorship.projectedInsolvencyAt * 1000

    const endDate = new Date(startDate + extensionInSeconds * 1000)

    const insufficientFunds = finalValue.isGreaterThan(toDecimals(balance, decimals))

    const canSubmit =
        finalValue.isFinite() &&
        finalValue.isGreaterThan(0) &&
        !insufficientFunds &&
        confirmState

    const [busy, setBusy] = useState(false)

    const dirty = rawAmount !== ''

    return (
        <FormModal
            {...props}
            title="Fund Sponsorship"
            canSubmit={canSubmit && !busy}
            submitting={busy}
            submitLabel="Fund"
            onBeforeAbort={(reason) =>
                !busy && (reason !== RejectionReason.Backdrop || !dirty)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    await fundSponsorship(sponsorship.id, finalValue, {
                        onBlockNumber: waitForIndexedBlock,
                    })

                    onResolve?.()
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
                Please set the amount of <SponsorshipPaymentTokenName /> to spend to
                extend the Sponsorship
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
                        step="any"
                        value={rawAmount}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
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
                            {balance.toString()} <SponsorshipPaymentTokenName />
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
                            {sponsorship.payoutPerDay.toString()}{' '}
                            <SponsorshipPaymentTokenName />
                            /day
                        </div>
                    </li>
                </ul>
            </Section>
            <SponsorshipDisclaimer
                sponsorship={sponsorship}
                onResolve={onResolve}
                checkboxState={confirmState}
                onCheckboxStateChange={(value) => setConfirmState(value)}
            />
        </FormModal>
    )
}

export const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)
