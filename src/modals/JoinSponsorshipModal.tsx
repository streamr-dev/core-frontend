import React, { useEffect, useReducer, useState } from 'react'
import BigNumber from 'bignumber.js'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { z } from 'zod'
import { RejectionReason } from '$app/src/modals/BaseModal'
import FormModal, {
    FieldWrap,
    FormModalProps,
    Group,
    GroupHeadline,
    Hint,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    CopyButtonWrapAppendix,
} from '$app/src/modals/FormModal'
import Label from '$ui/Label'
import useCopy from '$shared/hooks/useCopy'

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    onResolve?: (amount: string) => void
    operatorBalance?: string
    operatorId?: string
    amount?: string
    streamId?: string
}

function parseAmount(amount: string | undefined) {
    return typeof amount === 'undefined' || /^0?$/.test(amount)
        ? ''
        : new BigNumber(amount).dividedBy(1e18).toString()
}

export default function JoinSponsorshipModal({
    title = 'Join Sponsorship as Operator',
    submitLabel = 'Join',
    onResolve,
    operatorBalance: operatorBalanceProp = '0',
    operatorId = 'N/A',
    amount: amountProp = '0',
    streamId: streamIdProp,
    ...props
}: Props) {
    const streamId = streamIdProp || 'N/A'

    const [busy, setBusy] = useState(false)

    const operatorBalance = new BigNumber(operatorBalanceProp)

    const [rawAmount, setRawAmount] = useState(parseAmount(amountProp))

    const amount = new BigNumber(rawAmount || '0').multipliedBy(1e18)

    const finalAmount =
        amount.isFinite() && amount.isGreaterThan(0) ? amount : new BigNumber(0)

    useEffect(() => {
        setRawAmount(parseAmount(amountProp))
    }, [amountProp])

    const canSubmit = finalAmount.isGreaterThan(0)

    const { copy } = useCopy()

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy &&
                (new BigNumber(rawAmount || '0')
                    .multipliedBy(1e18)
                    .eq(amountProp || '0') ||
                    reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    await new Promise((resolve) => void setTimeout(resolve, 2000))

                    onResolve?.(finalAmount.toString())
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
                Please set the amount of DATA to stake on the selected Sponsorship
            </SectionHeadline>
            <Section>
                <Label>Sponsorship Stream ID</Label>
                <FieldWrap $grayedOut>
                    <TextInput defaultValue={streamId} readOnly />
                    {!!streamIdProp && (
                        <CopyButtonWrapAppendix>
                            <button
                                type="button"
                                onClick={() => {
                                    copy(streamIdProp, {
                                        toastMessage: 'Copied!',
                                    })
                                }}
                            >
                                <CopyIcon label="Copy" size="small" />
                            </button>
                        </CopyButtonWrapAppendix>
                    )}
                </FieldWrap>
                <Label>Amount to stake</Label>
                <FieldWrap>
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
                    <TextAppendix>DATA</TextAppendix>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop>Available balance in Operator contract</Prop>
                        <div>{operatorBalance.dividedBy(1e18).toString()} DATA</div>
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
