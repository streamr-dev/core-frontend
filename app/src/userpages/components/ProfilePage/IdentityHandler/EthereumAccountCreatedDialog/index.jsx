// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import type { Address } from '$shared/flowtype/web3-types'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

type Props = {
    onBack: () => void,
    onSave: () => void,
    name: string,
    address: Address,
}

const AddressWrapper = styled.div`
    background-color: #F8F8F8;
    padding: 1rem 1.5rem;
    margin-top: 2rem;
    width: 100%;
    text-align: left;
`

const Name = styled.div`
    color: #A3A3A3;
    font-family: var(--sans);
    font-size: 0.75rem;
    letter-spacing: 0;
    line-height: 1.5rem;
`

const EthAddress = styled.div`
    color: #323232;
    font-size: 0.875rem;
    font-weight: var(--medium);
    letter-spacing: 0;
    line-height: 1.5rem;
`

const EthereumAccountCreatedDialog = ({ onBack, onSave, name, address }: Props) => (
    <ModalPortal>
        <Dialog
            title="Ethereum account created"
            onClose={() => {}}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.back'),
                    kind: 'link',
                    outline: true,
                    onClick: () => onBack(),
                },
                save: {
                    title: 'Next',
                    kind: 'primary',
                    onClick: () => onSave(),
                },
            }}
        >
            <p>
                Your account has been created and the address
                <br />
                is shown below. Click next to get your private key.
            </p>
            <AddressWrapper>
                <Name>{name}</Name>
                <EthAddress>{address}</EthAddress>
            </AddressWrapper>
        </Dialog>
    </ModalPortal>
)

export default EthereumAccountCreatedDialog
