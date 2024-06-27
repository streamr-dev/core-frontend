import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { toaster } from 'toasterhea'
import { Abbr } from '~/components/Abbr'
import { SponsorshipDisclaimer } from '~/components/SponsorshipDisclaimer'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { DayInSeconds } from '~/consts'
import { useMediaQuery } from '~/hooks'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { toDecimals } from '~/marketplace/utils/math'
import FormModal, {
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
} from '~/modals/FormModal'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { fundSponsorship } from '~/services/sponsorships'
import Label from '~/shared/components/Ui/Label'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
import { pluralizeUnit } from '~/utils/pluralizeUnit'

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: bigint
    chainId: number
    onResolve?: () => void
    sponsorship: ParsedSponsorship
}

function FundSponsorshipModal({
    /**
     * @todo balance is now a #bigint and the assumption is that it's a float. Refactor.
     */
    balance,
    chainId,
    onResolve,
    sponsorship,
    ...props
}: Props) {
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

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

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
                    await fundSponsorship(chainId, sponsorship.id, finalValue, {
                        onBlockNumber: (blockNumber) =>
                            waitForIndexedBlock(chainId, blockNumber),
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
                <Label $wrap>Amount to sponsor</Label>
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
                    <MaxButton
                        onClick={() => {
                            setRawAmount(balance.toString())
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in your wallet</>
                            ) : (
                                <>Your wallet balance</>
                            )}
                        </Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{balance}</Abbr>
                            ) : (
                                <>
                                    {balance.toString()} <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Sponsorship extended by</Prop>
                        <PropValue>{extensionText}</PropValue>
                    </li>
                    <li>
                        <Prop>New end date</Prop>
                        <PropValue>
                            {moment(endDate).format(
                                limitedSpace ? 'YY-MM-DD' : 'YYYY-MM-DD',
                            )}
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Rate</Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr suffix="/day">{sponsorship.payoutPerDay}</Abbr>
                            ) : (
                                <>
                                    {sponsorship.payoutPerDay.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                    /day
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
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
