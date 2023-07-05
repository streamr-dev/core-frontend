import React from 'react'
import styled from 'styled-components'
import { SANS } from '~/shared/utils/styled'
import BaseModal, { BaseModalProps } from './BaseModal'

export interface ModalProps extends BaseModalProps {
    title?: string
}

/**
 * `BaseModal` with centered title bar with a subtle bottom border.
 */
export default function Modal({
    children,
    title = 'Untitled modal',
    ...props
}: ModalProps) {
    return (
        <BaseModal {...props}>
            <Root>
                <Head>
                    <Title>{title}</Title>
                </Head>
                {children}
            </Root>
        </BaseModal>
    )
}

const Root = styled.div`
    max-width: 560px;
    width: 90vw;
`

const Head = styled.div`
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    display: flex;
    font-family: ${SANS};
    font-size: 20px;
    font-weight: normal;
    height: 80px;
    line-height: 32px;
    margin: 0;
    position: relative;
    text-align: center;
    width: 100%;
`

const Title = styled.div`
    flex-grow: 1;
`
