import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    Section,
    SectionHeadline,
    TextAppendix,
    TextareaCounter,
    TextareaInput,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import Help from '~/components/Help'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (cut: number, name: string, description?: string) => void
    onSubmit: (cut: number, name: string, description?: string) => Promise<void>
    cut?: number
}

export default function BecomeOperatorModal({
    title = 'Become an Operator',
    submitLabel = 'Become an Operator',
    onResolve,
    onSubmit,
    cut: cutProp,
    ...props
}: Props) {
    const [busy, setBusy] = useState(false)

    const [cutValue, setCutValue] = useState<string | undefined>(cutProp?.toString())
    const [name, setName] = useState<string | undefined>()
    const [description, setDescription] = useState<string | undefined>()

    const cutValueNumeric = Number(cutValue || undefined) // so that it will be a NaN if it's empty string

    useEffect(() => {
        setCutValue(cutProp?.toString())
    }, [cutProp])

    const cutValueIsValid = useMemo<boolean>(
        () => !isNaN(cutValueNumeric) && cutValueNumeric >= 0 && cutValueNumeric <= 100,
        [cutValueNumeric],
    )

    const cutValueIsTouchedAndInvalid = useMemo<boolean>(
        () => typeof cutValue !== 'undefined' && !cutValueIsValid,
        [cutValue, cutValueIsValid],
    )

    const nameIsValid = useMemo(() => !!name, [name])

    const nameIsTouchedAndInvalid = useMemo(() => name === '', [name])

    const descriptionLengthLimit = 120

    const descriptionTooLong = (description?.length || 0) > 120

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={cutValueIsValid && nameIsValid && !descriptionTooLong && !busy}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (cutValue === cutProp || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    await onSubmit(cutValueNumeric, name as string, description)
                    onResolve?.(cutValueNumeric, name as string, description)
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
                <WingedLabelWrap>
                    <Label>
                        <LabelInner>
                            <span>Operator&apos;s cut percentage*</span>
                            <Help align="center">
                                <p>
                                    The cut taken by the Operator from all earnings. This
                                    percentage can not be changed later. The rest is
                                    shared among Delegators including the Operator&apos;s
                                    own&nbsp;stake.
                                </p>
                            </Help>
                        </LabelInner>
                    </Label>
                    {cutValueIsTouchedAndInvalid && (
                        <ErrorLabel>Value must be between 0 and 100</ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={cutValueIsTouchedAndInvalid}>
                    <TextInput
                        name="cut"
                        autoFocus
                        onChange={({ target }) =>
                            void setCutValue(
                                target.value ? Number(target.value).toString() : '',
                            )
                        }
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        max={100}
                        value={typeof cutValue !== 'undefined' ? cutValue : ''}
                    />
                    <TextAppendix>%</TextAppendix>
                </FieldWrap>
            </Section>
            <AboutOperator>
                <SectionHeadline>About operator</SectionHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label>
                            <LabelInner>
                                <span>Display name*</span>
                            </LabelInner>
                        </Label>
                        {nameIsTouchedAndInvalid && (
                            <ErrorLabel>Name is required</ErrorLabel>
                        )}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={nameIsTouchedAndInvalid}>
                        <TextInput
                            name="name"
                            onChange={({ target }) => setName(target.value)}
                            readOnly={busy}
                            type="text"
                            value={name || ''}
                            placeholder={'Name'}
                        />
                    </FieldWrap>

                    <AboutOperatorField>
                        <WingedLabelWrap>
                            <Label>
                                <LabelInner>
                                    <span>Description</span>
                                </LabelInner>
                            </Label>
                            {descriptionTooLong && (
                                <ErrorLabel>Description is too long</ErrorLabel>
                            )}
                        </WingedLabelWrap>
                        <FieldWrap $invalid={descriptionTooLong}>
                            <TextareaInput
                                name="description"
                                onChange={({ target }) => setDescription(target.value)}
                                readOnly={busy}
                                value={description || ''}
                                placeholder={'Description'}
                                $minHeight={110}
                            />
                            <TextareaCounter $invalid={descriptionTooLong}>
                                {description?.length || 0}/{descriptionLengthLimit}
                            </TextareaCounter>
                        </FieldWrap>
                    </AboutOperatorField>
                </Section>
            </AboutOperator>
        </FormModal>
    )
}

const LabelInner = styled.div`
    align-items: center;
    display: flex;
`

const AboutOperator = styled.div`
    margin-top: 40px;
`

const AboutOperatorField = styled.div`
    margin-top: 16px;
`
