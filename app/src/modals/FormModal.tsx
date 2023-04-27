import React from 'react'
import styled from 'styled-components'
import { COLORS, SANS, TABLET } from '$shared/utils/styled'
import Buttons, { ButtonActions } from '$shared/components/Buttons'
import SvgIcon from '$shared/components/SvgIcon'
import BaseModal, { BaseModalProps, Footer, RejectionReason } from './BaseModal'

export interface FormModalProps extends BaseModalProps {
    title?: string
    onSubmit?: () => void | Promise<void>
    submitLabel?: string
    cancelLabel?: string
    canSubmit?: boolean
}

export default function FormModal({
    title = 'Untitled modal',
    onSubmit,
    children,
    onReject,
    submitLabel = 'Submit',
    cancelLabel,
    canSubmit = true,
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
    }

    return (
        <BaseModal {...props} onReject={onReject}>
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
                            onClick={() => {
                                onReject?.(RejectionReason.CloseButton)
                            }}
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
