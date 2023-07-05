import React from 'react'
import styled from 'styled-components'
import PngIcon from '~/shared/components/PngIcon'
import Buttons from '~/shared/components/Buttons'
import Modal from './Modal'
import { Footer, RejectionReason } from './BaseModal'

const Content = styled.div`
    padding: 64px 0;
    text-align: center;

    p {
        margin: 32px auto 0;
        padding: 0 96px;
        position: relative;
    }
`

const IconWrap = styled.div`
    height: 66px;
    margin: 0 auto;
    width: 94px;

    img {
        display: block;
        transform: translate(-11%, -23%);
    }
`

interface Props {
    onResolve?: () => void
    onReject?: (reason?: unknown) => void
}

export default function FailedPurchaseModal({ onReject, onResolve }: Props) {
    return (
        <Modal title="Access failed" onReject={onReject} darkBackdrop>
            <Content>
                <IconWrap>
                    <PngIcon name="walletError" width="110" height="110" />
                </IconWrap>
                <p>
                    Failed to access the project. Please check your wallet or other
                    settings and try again.
                </p>
            </Content>
            <Footer>
                <Buttons
                    actions={{
                        cancel: {
                            title: 'Go back',
                            kind: 'link',
                            onClick() {
                                onReject?.(RejectionReason.CancelButton)
                            },
                        },
                        ok: {
                            title: 'Try again',
                            kind: 'primary',
                            onClick() {
                                onResolve?.()
                            },
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}
