import React from 'react'
import styled from 'styled-components'
import { COLORS, SANS } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { RejectionReason } from '~/utils/exceptions'
import BaseModal, { BaseModalProps } from './BaseModal'

export interface ModalProps extends BaseModalProps {
    title?: string
}

/**
 * `BaseModal` with left-aligned title bar and a close button.
 */
export default function LightModal({
    children,
    title = 'Untitled modal',
    ...props
}: ModalProps) {
    return (
        <BaseModal {...props}>
            {(close) => (
                <Root>
                    <Head>
                        <Title>{title}</Title>
                        <CloseButton
                            type="button"
                            onClick={() => void close(RejectionReason.CloseButton)}
                        >
                            <SvgIcon name="crossMedium" />
                        </CloseButton>
                    </Head>
                    <Content>
                        {typeof children === 'function' ? children(close) : children}
                    </Content>
                </Root>
            )}
        </BaseModal>
    )
}

const Root = styled.div`
    max-width: 560px;
    width: 90vw;
    padding: 40px;
    display: grid;
    grid-template-rows: auto auto;
    gap: 24px;
`

const Head = styled.div`
    display: flex;
    font-family: ${SANS};
    font-size: 20px;
    font-weight: normal;
    line-height: 32px;
    margin: 0;
    position: relative;
    text-align: left;
    width: 100%;
    align-items: center;
`

const Title = styled.div`
    flex-grow: 1;
    color: ${COLORS.primary};
`

const Content = styled.div`
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${COLORS.primaryLight};
`

export const CloseButton = styled.button`
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
