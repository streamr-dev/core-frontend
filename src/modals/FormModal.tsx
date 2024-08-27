import React, { ComponentProps, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { ButtonActions, Buttons } from '~/components/Buttons'
import SvgIcon from '~/shared/components/SvgIcon'
import Label from '~/shared/components/Ui/Label'
import { COLORS, MEDIUM, REGULAR, SANS, TABLET } from '~/shared/utils/styled'
import { RejectionReason } from '~/utils/exceptions'
import BaseModal, { BaseModalProps, Footer } from './BaseModal'

export interface FormModalProps extends Omit<BaseModalProps, 'children'> {
    children?: ReactNode
    title?: string
    onSubmit?: () => void | Promise<void>
    submitLabel?: string
    cancelLabel?: string
    canSubmit?: boolean
    submitting?: boolean
}

export default function FormModal({
    title = 'Untitled modal',
    onSubmit,
    children,
    onReject,
    submitLabel = 'Submit',
    cancelLabel,
    canSubmit = true,
    submitting = false,
    ...props
}: FormModalProps) {
    const actions: ButtonActions = {}

    if (cancelLabel) {
        actions.cancel = {
            title: cancelLabel,
            kind: 'link',
            type: 'button',
            onClick() {
                onReject?.(RejectionReason.CancelButton)
            },
        }
    }

    actions.ok = {
        title: submitLabel,
        kind: 'primary',
        type: 'submit',
        disabled: !canSubmit,
        spinner: submitting,
    }

    return (
        <BaseModal {...props} onReject={onReject}>
            {(close) => (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()

                        try {
                            await onSubmit?.()
                        } catch (e) {
                            onReject?.(e)
                        }
                    }}
                >
                    <FormModalRoot>
                        <FormModalHead>
                            <FormModalTitle>{title}</FormModalTitle>
                            <FormModalCloseButton
                                type="button"
                                onClick={() => void close(RejectionReason.CloseButton)}
                                disabled={submitting}
                            >
                                <SvgIcon name="crossMedium" />
                            </FormModalCloseButton>
                        </FormModalHead>
                        <FormModalContent>{children}</FormModalContent>
                        <Footer $borderless $spacious>
                            <Buttons actions={actions} />
                        </Footer>
                    </FormModalRoot>
                </form>
            )}
        </BaseModal>
    )
}

export const FormModalContent = styled.div`
    padding: 0 40px;
`

export const FormModalRoot = styled.div`
    max-width: 672px;
    width: 90vw;
`

export const FormModalHead = styled.div`
    align-items: center;
    display: flex;
    font-family: ${SANS};
    font-size: 24px;
    font-weight: normal;
    height: 100px;
    line-height: normal;
    margin: 0;
    position: relative;
    padding: 20px 40px 0;
    width: 100%;

    @media ${TABLET} {
        height: 120px;
        padding-top: 0;
    }
`

export const FormModalTitle = styled.div`
    flex-grow: 1;
`

export const FormModalCloseButton = styled.button`
    color: ${COLORS.close};
    line-height: 14px;
    cursor: pointer;
    padding: 0.5rem;
    margin: 0;
    background: none;
    outline: none;
    border: none;

    &:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    & > svg {
        width: 14px;
        height: 14px;
    }
`

export const SectionHeadline = styled.h4`
    font-size: 14px;
    font-weight: normal;
    line-height: 24px;
    margin: 20px 0 8px;
    display: flex;
    align-items: center;
    &:first-of-type {
        margin: 0 0 8px;
    }
`

export const Hint = styled.div`
    color: ${COLORS.primaryLight};
    font-size: 12px;
    margin-top: 8px;
    line-height: 20px;

    p {
        margin: 0;
        width: 90%;
    }

    p + p {
        margin-top: 0.25em;
    }
`

export const Section = styled.div`
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
    background: ${COLORS.section};
    border-radius: 8px;
    padding: 16px;

    ${Label} {
        line-height: 20px;
    }

    & + & {
        margin-top: 16px;
    }
`

export const Prop = styled.em<{ $invalid?: boolean }>`
    color: ${COLORS.primaryLight};
    display: block;
    flex-grow: 1;
    font-size: 12px;
    font-style: normal;
    font-weight: ${MEDIUM};
    opacity: 0.7;

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            color: ${COLORS.error};
        `}
`

export const PropValue = styled.div`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const PropList = styled.ul`
    background: ${COLORS.secondaryLight};
    font-size: 14px;
    list-style: none;
    margin: 16px 0 0;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);

    li {
        align-items: center;
        display: flex;
        gap: 8px;
    }

    li + li {
        margin-top: 16px;
    }
`

export const GroupHeadline = styled.h2`
    font-size: 18px;
    line-height: 24px;
    font-weight: ${REGULAR};
    margin: 0 0 24px;
    border-bottom: 1px solid #efefef;
    padding: 0 0 16px;
`

export const Group = styled.div`
    & + & {
        margin-top: 40px;
    }
`

export const WingedLabelWrap = styled.div`
    display: flex;
    align-items: center;

    ${Label} {
        flex-grow: 1;
        min-width: 0;
    }

    ${Label} + ${Label} {
        flex-grow: 0;
    }
`

export const ErrorWrap = styled.div`
    text-align: right;
`

export const ErrorLabel = styled(Label)`
    color: ${COLORS.error};
    opacity: 0.7;
`
export const TextInput = styled.input`
    background: none;
    border: 0;
    backface-visibility: hidden;
    font-size: inherit;
    height: 100%;
    color: ${COLORS.primary};
    padding: 0 18px;
    flex-grow: 1;
    outline: 0;
    min-width: 48px;

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type='number'] {
        -moz-appearance: textfield;
    }

    &::placeholder {
        color: ${COLORS.primaryDisabled};
    }
`

export const TextareaInput = styled.textarea<{ $minHeight?: number }>`
    background: none;
    border: 0;
    backface-visibility: hidden;
    font-size: inherit;
    height: 100%;
    color: ${COLORS.primary};
    padding: 8px 18px 36px;
    flex-grow: 1;
    outline: 0;
    resize: none;

    ${({ $minHeight }) =>
        $minHeight &&
        css`
            min-height: ${$minHeight}px;
        `}

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &::placeholder {
        color: ${COLORS.primaryDisabled};
    }
`

export const TextareaCounter = styled.span<{ $invalid?: boolean }>`
    position: absolute;
    bottom: 8px;
    right: 18px;
    color: ${COLORS.primaryLight};

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            color: ${COLORS.error};
        `}
`

const Appendix = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    height: 100%;
`

export const TextAppendix = styled(Appendix)`
    padding: 0 18px;
`

export const FieldWrap = styled.div<{
    $invalid?: boolean
    $grayedOut?: boolean
    $top?: boolean
    $bottom?: boolean
    $padded?: boolean
}>`
    display: flex;
    position: relative;
    border: 1px solid transparent;
    align-items: center;
    background: ${COLORS.primaryContrast};
    font-size: 14px;
    border-radius: 8px;
    min-height: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

    :focus-within {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    }

    & + ${Label} {
        margin-top: 24px;
    }

    ${TextAppendix} {
        border-left: 1px solid ${COLORS.Border};
    }

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            border: 1px solid ${COLORS.error};

            ${TextAppendix} {
                border-color: ${COLORS.error};
            }
        `}

    ${({ $grayedOut = false }) =>
        $grayedOut &&
        css`
            border-color: ${COLORS.secondaryLight};
            background: ${COLORS.secondaryLight};
        `}

    ${({ $top = false }) =>
        $top &&
        css`
            border-radius: 8px 8px 0 0;
        `}

    ${({ $bottom = false }) =>
        $bottom &&
        css`
            border-radius: 0 0 8px 8px;
            border-top: 1px solid;
            border-color: ${COLORS.secondaryLight};
        `}

    ${({ $padded = false }) =>
        $padded &&
        css`
            padding: 0 16px;
        `}
`
export const CopyButtonWrapAppendix = styled(Appendix)`
    padding: 0 16px 0 0;

    button {
        align-items: center;
        appearance: none;
        background: ${COLORS.primaryContrast};
        border: 0;
        color: ${COLORS.primaryLight};
        display: flex;
        height: 24px;
        justify-content: center;
        width: 24px;
    }
`
export const IconWrapAppendix = styled(Appendix)`
    color: ${COLORS.primaryDisabled};
    padding-right: 10px;
`

function getMaxButtonAttrs(): ComponentProps<'button'> {
    return {
        type: 'button',
        children: 'MAX',
    }
}

export const MaxButton = styled.button.attrs(getMaxButtonAttrs)`
    appearance: none;
    background: #f8f8f8;
    border: 0;
    border-radius: 4px;
    color: #0324ff;
    flex: 0;
    font-size: 12px;
    font-weight: ${MEDIUM};
    line-height: normal;
    padding: 2px 4px;

    & + * {
        margin-left: 12px;
    }
`
