import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { useWalletAccount } from '~/shared/stores/wallet'
import NoWalletOverlay from './NoWalletOverlay'

export default function WalletPass({
    children,
    resourceName,
    roundBorders = false,
}: {
    children?: ReactNode
    resourceName: string
    roundBorders?: boolean
}) {
    const locked = !useWalletAccount()

    return (
        <Root $roundBorders={roundBorders}>
            <Content $blur={locked}>{children}</Content>
            {locked ? <NoWalletOverlay resourceName={resourceName} /> : <></>}
        </Root>
    )
}

const Root = styled.div<{ $roundBorders?: boolean }>`
    position: relative;

    ${({ $roundBorders = false }) =>
        $roundBorders &&
        css`
            border-radius: 16px;
            overflow: hidden;
        `}
`

const Content = styled.div<{ $blur?: boolean }>`
    transition: 350ms filter;

    ${({ $blur = false }) =>
        $blur &&
        css`
            filter: blur(5px);
        `}
`
