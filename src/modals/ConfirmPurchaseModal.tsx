import React from 'react'
import styled from 'styled-components'
import Buttons from '~/shared/components/Buttons'
import Modal from './Modal'
import { Footer } from './BaseModal'

const Content = styled.p`
    margin: 56px 0;
    padding: 0 108px;
    text-align: center;
`

export default function ConfirmPurchaseModal() {
    return (
        <Modal title="Payment confirmation" onBeforeAbort={() => false} darkBackdrop>
            <Content>
                You need to confirm the transaction in your wallet to access this project
            </Content>
            <Footer>
                <Buttons
                    actions={{
                        ok: {
                            title: 'Waiting',
                            kind: 'primary',
                            spinner: true,
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}
