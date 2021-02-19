// @flow

import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import WalletErrorPng from '$shared/assets/images/wallet_error.png'
import WalletErrorPng2x from '$shared/assets/images/wallet_error@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './installMetaMaskDialog.pcss'

export type Props = {
    onClose: () => void,
}

const InstallMetaMaskDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title="No wallet found"
        >
            <img className={styles.icon} src={WalletErrorPng} srcSet={`${WalletErrorPng2x} 2x`} alt="Wallet error" />
            <p>
                We couldn&apos;t find your wallet. Please install
                <br />
                MetaMask or another wallet and try again.
            </p>
        </Dialog>
    </ModalPortal>
)

export default InstallMetaMaskDialog
