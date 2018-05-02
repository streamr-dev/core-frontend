// @flow

import React from 'react'

import walletImg from '../../../../assets/wallet_icon.png'

import Dialog from '../Dialog'
import styles from './unlockWallet.pcss'

export type Props = {
    onCancel: () => void,
    lightBackdrop?: boolean,
    message?: string,
}

const UnlockWalletDialog = ({ onCancel, message, lightBackdrop }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Access your wallet"
        lightBackdrop={lightBackdrop}
    >
        <img src={walletImg} alt="Access your wallet" />
        {message && (
            <p className={styles.text}>{message}</p>
        )}
    </Dialog>
)

export default UnlockWalletDialog
