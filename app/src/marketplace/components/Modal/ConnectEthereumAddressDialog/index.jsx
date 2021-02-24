// @flow

import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

export type Props = {
    onCancel: () => void,
    onSet: () => void | Promise<void>,
    waiting?: boolean,
}

const ConnectEthereumAddressDialog = ({ onCancel, onSet, waiting }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title="Connect your Ethereum address"
            actions={{
                cancel: {
                    title: 'Cancel',
                    kind: 'link',
                    onClick: onCancel,
                },
                next: {
                    title: 'Next',
                    outline: true,
                    onClick: () => onSet(),
                    disabled: !!waiting,
                    spinner: !!waiting,
                },
            }}
        >
            <p>
                Connect your Ethereum address to see your subscriptions.
                <br />
                Sign this step in your wallet to proceed.
            </p>
        </Dialog>
    </ModalPortal>
)

export default ConnectEthereumAddressDialog
