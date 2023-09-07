import React, { useEffect, useState } from 'react'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    CopyButtonWrapAppendix,
    FieldWrap,
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import useCopy from '~/shared/hooks/useCopy'
import { toBN } from '~/utils/bn'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onSubmit: (amountWei: string) => void
    onResolve?: (amountWei: string) => void
    operatorBalance?: string
    tokenSymbol?: string
    decimals?: number
    operatorId?: string
    amount?: string
    streamId?: string
}

function parseAmount(amount: string | undefined) {
    return typeof amount === 'undefined' || /^0?$/.test(amount)
        ? ''
        : toBN(amount).dividedBy(1e18).toString()
}

export default function JoinSponsorshipModal({
    title = 'Join Sponsorship as Operator',
    submitLabel = 'Join',
    onResolve,
    onSubmit,
    operatorBalance: operatorBalanceProp = '0',
    operatorId = 'N/A',
    amount: amountProp = '0',
    streamId: streamIdProp,
    tokenSymbol = 'DATA',
    decimals = 18,
    ...props
}: Props) {
    const streamId = streamIdProp || 'N/A'

    const [busy, setBusy] = useState(false)

    const operatorBalance = toBN(operatorBalanceProp)

    const [rawAmount, setRawAmount] = useState(parseAmount(amountProp))

    const amount = toBN(rawAmount || '0').multipliedBy(Math.pow(10, decimals))

    const finalAmount = amount.isFinite() && amount.isGreaterThan(0) ? amount : toBN(0)

    useEffect(() => {
        setRawAmount(parseAmount(amountProp))
    }, [amountProp])

    const insufficientFunds = finalAmount.isGreaterThan(operatorBalance)

    const canSubmit = finalAmount.isGreaterThan(0) && !insufficientFunds

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
                (toBN(rawAmount || '0')
                    .multipliedBy(Math.pow(10, decimals))
                    .eq(amountProp || '0') ||
                    reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await onSubmit(finalAmount.toString())
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
                Please set the amount of {tokenSymbol} to stake on the selected
                Sponsorship
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
                    <TextAppendix>{tokenSymbol}</TextAppendix>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator contract</>
                            ) : (
                                <>Available balance in Operator contract</>
                            )}
                        </Prop>
                        <div>
                            {operatorBalance.dividedBy(Math.pow(10, decimals)).toString()}{' '}
                            {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                </ul>
            </Section>
            {/*TODO Use Alert component here*/}
        </FormModal>
    )
}
