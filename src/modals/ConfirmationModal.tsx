import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import InfoIcon from '@atlaskit/icon/glyph/info'
import BaseModal, { BaseModalProps, RejectionReason } from '~/modals/BaseModal'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'

export type ConfirmationModalProps = {
    title: string
    description: ReactNode
    proceedLabel: string
    cancelLabel: string
}

interface Props
    extends ConfirmationModalProps,
        Omit<BaseModalProps, 'children' | 'onResolve'> {
    onResolve?: (decision: boolean) => void
}

const ConfirmationModal: FunctionComponent<Props> = ({
    title,
    description,
    proceedLabel,
    cancelLabel,
    onResolve,
    ...props
}) => {
    return (
        <BaseModal {...props}>
            {(close) => (
                <ModalBody>
                    <Icon>
                        <IconWrap $color="#6240AF">
                            <InfoIcon label="Info" />
                        </IconWrap>
                    </Icon>
                    <Title>{title}</Title>
                    <CloseButton
                        type="button"
                        onClick={() => void close(RejectionReason.CloseButton)}
                    >
                        <SvgIcon name="crossMedium" />
                    </CloseButton>
                    <Description>{description}</Description>
                    <DecisionButtons>
                        <DecisionButton onClick={() => void onResolve?.(true)}>
                            {proceedLabel}
                        </DecisionButton>
                        <Dot />
                        <DecisionButton
                            onClick={() => close(RejectionReason.CloseButton)}
                        >
                            {cancelLabel}
                        </DecisionButton>
                    </DecisionButtons>
                </ModalBody>
            )}
        </BaseModal>
    )
}

export const confirmationModal = toaster(ConfirmationModal, Layer.Modal)

const ModalBody = styled.div`
    display: grid;
    grid-template-columns: 24px auto 24px;
    grid-template-rows: auto auto auto;
    padding: 20px 16px;
    grid-gap: 16px;
    width: 400px;
`

const Icon = styled.div`
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 1;
    grid-column-end: 1;
    width: 24px;
    height: 24px;
`

const CloseButton = styled.button`
    color: ${COLORS.close};
    line-height: 14px;
    cursor: pointer;
    padding: 5px;
    margin: 0;
    background: none;
    outline: none;
    border: none;
    > svg {
        width: 12px;
        height: 12px;
    }
`

const Title = styled.p`
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 2;
    grid-column-end: 2;
    font-weight: ${MEDIUM};
    margin: 0;
    font-size: 16px;
`

const Description = styled.p`
    grid-row-start: 2;
    grid-row-end: 2;
    grid-column-start: 2;
    grid-column-end: 2;
    margin: 0;
    font-size: 14px;
    line-height: 20px;
`

const DecisionButtons = styled.div`
    grid-row-start: 3;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 2;
    display: flex;
    align-items: center;
    gap: 8px;
`

const DecisionButton = styled.p`
    margin: 0;
    color: ${COLORS.link};
    cursor: pointer;
`

const Dot = styled.div`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: ${COLORS.primary};
`

const IconWrap = styled.div<{ $color?: string }>`
    height: 24px;
    width: 24px;
    position: relative;
    display: flex;
    items-center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 16px;
    color: ${({ $color = 'inherit' }) => $color};
`
