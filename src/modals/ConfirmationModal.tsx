import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import InfoIcon from '@atlaskit/icon/glyph/info'
import { toaster } from 'toasterhea'
import BaseModal, { BaseModalProps } from '~/modals/BaseModal'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import { RejectionReason } from '~/utils/exceptions'

export type ConfirmationModalProps = {
    title: string
    description: ReactNode
    proceedLabel: string
    cancelLabel: string
    isDangerous?: boolean
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
    isDangerous = false,
    onResolve,
    ...props
}) => {
    return (
        <BaseModal {...props}>
            {(close) => (
                <ModalBody>
                    <Icon>
                        <IconWrap $color={isDangerous ? '#ff0f2d' : '#6240AF'}>
                            <InfoIcon label="Info" />
                        </IconWrap>
                    </Icon>
                    <Title $isDangerous={isDangerous}>{title}</Title>
                    <CloseButton
                        type="button"
                        onClick={() => void close(RejectionReason.CloseButton)}
                    >
                        <SvgIcon name="crossMedium" />
                    </CloseButton>
                    <Description>{description}</Description>
                    <DecisionButtons>
                        <DecisionButton
                            onClick={() => void onResolve?.(true)}
                            $isDangerous={isDangerous}
                        >
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

const Title = styled.p<{ $isDangerous?: boolean }>`
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 2;
    grid-column-end: 2;
    font-weight: ${MEDIUM};
    margin: 0;
    font-size: 16px;
    color: ${({ $isDangerous }) => ($isDangerous ? '#ff0f2d' : 'inherit')};
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

const DecisionButton = styled.p<{ $isDangerous?: boolean }>`
    margin: 0;
    color: ${({ $isDangerous }) => ($isDangerous ? '#ff0f2d' : COLORS.link)};
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
