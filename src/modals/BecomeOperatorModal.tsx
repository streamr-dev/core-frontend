import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
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
    operatorId?: string
    onResolve?: (cut: number) => void
    cut?: number
    balance: string
}

export default function BecomeOperatorModal({
    title = 'Become an Operator',
    submitLabel = 'Become an Operator',
    balance: balanceProp = '0',
    onResolve,
    operatorId = 'N/A',
    cut: cutProp,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const cut = `${cutProp || ''}`

    const [rawValue, setRawValue] = useState(cut)

    useEffect(() => {
        setRawValue(cut)
    }, [cut])

    const value = rawValue || '0'

    const numericValue = Number.parseFloat(value)

    const canSubmit =
        `${numericValue}` === value && numericValue >= 0 && numericValue <= 100

    const balance = new BigNumber(balanceProp).dividedBy(1e18).toString()

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (rawValue === cut || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    /**
                     * Replace the following with your favourite contract interaction! <3
                     */
                    await new Promise((resolve) => void setTimeout(resolve, 2000))

                    onResolve?.(numericValue)
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
                Please choose the percentage for the Operator&apos;s cut
            </SectionHeadline>
            <Section>
                <Label>Operator&apos;s cut percentage</Label>
                <FieldWrap>
                    <TextInput
                        name="cut"
                        autoFocus
                        onChange={({ target }) => void setRawValue(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        max={100}
                        value={rawValue}
                    />
                    <TextAppendix>%</TextAppendix>
                </FieldWrap>
                <Hint>
                    <p>
                        The cut taken by the Operator from all earnings. This percentage
                        can not be changed later. The rest is shared among Delegators
                        including the Operator&apos;s own stake.
                    </p>
                </Hint>
                <ul>
                    <li>
                        <Prop>Your wallet balance</Prop>
                        <div>{balance} DATA</div>
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
