import React, { HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { COLORS, MEDIUM, REGULAR, SANS, TABLET } from '~/shared/utils/styled'
import Buttons, { ButtonActions } from '~/shared/components/Buttons'
import SvgIcon from '~/shared/components/SvgIcon'
import Label from '~/shared/components/Ui//Label'
import BaseModal, { BaseModalProps, Footer, RejectionReason } from './BaseModal'

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

                        await onSubmit?.()
                    }}
                >
                    <Root>
                        <Head>
                            <Title>{title}</Title>
                            <CloseButton
                                type="button"
                                onClick={close}
                                disabled={submitting}
                            >
                                <SvgIcon name="crossMedium" />
                            </CloseButton>
                        </Head>
                        <Content>{children}</Content>
                        <Footer $borderless $spacious>
                            <Buttons actions={actions} />
                        </Footer>
                    </Root>
                </form>
            )}
        </BaseModal>
    )
}

const Content = styled.div`
    padding: 0 40px;
`

const Root = styled.div`
    max-width: 672px;
    width: 90vw;
`

const Head = styled.div`
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

const Title = styled.div`
    flex-grow: 1;
`

const CloseButton = styled.button`
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
    margin: 0 0 8px;
`

export const Hint = styled.div`
    color: #525252;
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
    background: #f1f1f1;
    border-radius: 8px;
    padding: 16px;

    ${Label} {
        line-height: 20px;
    }

    ul {
        background: #f8f8f8;
        font-size: 14px;
        list-style: none;
        margin: 16px 0 0;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
    }

    li {
        display: flex;
        align-items: center;
    }

    li + li {
        margin-top: 16px;
    }

    & + & {
        margin-top: 16px;
    }
`

export const Prop = styled.em<{ $invalid?: boolean }>`
    opacity: 0.7;
    color: #525252;
    flex-grow: 1;
    display: block;
    font-style: normal;
    font-size: 12px;
    font-weight: ${MEDIUM};

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            color: #d90c25;
        `}
`

export const Appendix = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    height: 100%;
`

export const TextAppendix = styled(Appendix)`
    padding: 0 18px;
`

export const FieldWrap = styled.div<{ $invalid?: boolean; $grayedOut?: boolean }>`
    display: flex;
    border: 1px solid transparent;
    align-items: center;
    background: #ffffff;
    font-size: 14px;
    border-radius: 8px;
    height: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

    :focus-within {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    }

    & + ${Label} {
        margin-top: 24px;
    }

    ${TextAppendix} {
        border-left: 1px solid #efefef;
    }

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            border: 1px solid #d90c25;

            ${TextAppendix} {
                border-color: #d90c25;
            }
        `}

    ${({ $grayedOut = false }) =>
        $grayedOut &&
        css`
            border-color: #f8f8f8;
            background: #f8f8f8;
        `}
`

export const TextInput = styled.input`
    background: none;
    border: 0;
    backface-visibility: hidden;
    font-size: inherit;
    height: 100%;
    color: #323232;
    padding: 0 18px;
    flex-grow: 1;
    outline: 0;

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type='number'] {
        -moz-appearance: textfield;
    }

    &::placeholder {
        color: #a3a3a3;
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

export const CopyButtonWrapAppendix = styled(Appendix)`
    padding: 0 16px 0 0;

    button {
        align-items: center;
        appearance: none;
        background: #ffffff;
        border: 0;
        color: #525252;
        display: flex;
        height: 24px;
        justify-content: center;
        width: 24px;
    }
`

export const IconWrapAppendix = styled(Appendix)`
    color: #a3a3a3;
    padding-right: 10px;
`

export const WingedLabelWrap = styled.div`
    display: flex;
    align-items: center;

    ${Label} {
        flex-grow: 1;
    }

    ${Label} + ${Label} {
        flex-grow: 0;
    }
`

export const ErrorLabel = styled(Label)`
    color: #d90c25;
    opacity: 0.7;
`