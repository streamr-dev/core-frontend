import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui//Label'
import Help from '~/components/Help'
import { toBN } from '~/utils/bn'
import { FieldWrap, TextAppendix, TextInput } from '~/components/TextInput'

interface Props extends Omit<FormModalProps, 'canSubmit'> {
    operatorId?: string
    onResolve?: (cut: number) => void
    cut?: number
    balance?: string
    tokenSymbol?: string
}

export default function BecomeOperatorModal({
    title = 'Become an Operator',
    submitLabel = 'Become an Operator',
    balance: balanceProp = '0',
    onResolve,
    operatorId = 'N/A',
    cut: cutProp,
    tokenSymbol = 'DATA',
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

    const balance = toBN(balanceProp).dividedBy(1e18).toString()

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
                <Label>
                    <LabelInner>
                        <span>Operator&apos;s cut percentage</span>
                        <Help align="center">
                            <p>
                                The cut taken by the Operator from all earnings. This
                                percentage can not be changed later. The rest is shared
                                among Delegators including the Operator&apos;s
                                own&nbsp;stake.
                            </p>
                        </Help>
                    </LabelInner>
                </Label>
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
                <ul>
                    <li>
                        <Prop>Your wallet balance</Prop>
                        <div>
                            {balance} {tokenSymbol}
                        </div>
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

const LabelInner = styled.div`
    align-items: center;
    display: flex;
`
