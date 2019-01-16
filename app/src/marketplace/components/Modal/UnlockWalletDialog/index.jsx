// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import WalletPng from '$shared/assets/images/wallet.png'
import WalletPng2x from '$shared/assets/images/wallet@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './unlockwalletdialog.pcss'

export type Props = {
    onClose: () => void,
    message?: string,
}

const UnlockWalletDialog = ({ onClose, message, translate, ...props }: Props) => (
    <Dialog
        onClose={onClose}
        title={I18n.t('modal.unlockWallet.title')}
        {...props}
    >
        <img className={styles.walletIcon} src={WalletPng} srcSet={`${WalletPng2x} 2x`} alt={I18n.t('error.wallet')} />
        {message && (
            <p>{message}</p>
        )}
    </Dialog>
)

export default UnlockWalletDialog
