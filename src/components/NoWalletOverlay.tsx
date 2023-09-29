import React from 'react'
import { toaster } from 'toasterhea'
import styled from 'styled-components'
import ConnectModal from '~/modals/ConnectModal'
import Button from '~/shared/components/Button'
import { Layer } from '~/utils/Layer'
import { COLORS } from '~/shared/utils/styled'

export default function NoWalletOverlay({ resourceName }: { resourceName: string }) {
    return (
        <Root>
            <Content>
                <p>Please connect wallet to view your {resourceName}</p>
                <Button
                    kind="primary"
                    size="mini"
                    outline
                    type="button"
                    onClick={async () => {
                        try {
                            await toaster(ConnectModal, Layer.Modal).pop()
                        } catch (e) {
                            console.warn('Wallet connecting failed', e)
                        }
                    }}
                >
                    Connect
                </Button>
            </Content>
        </Root>
    )
}

const Root = styled.div`
    align-items: center;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    p {
        font-size: 16px;
        color: ${COLORS.primaryLight};
        margin: 0 0 24px;
    }
`

const Content = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    text-align: center;
`
