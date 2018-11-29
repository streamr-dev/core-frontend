// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import WalletPng from '../../../assets/wallet.png'
import WalletPng2x from '../../../assets/wallet@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './unlockwalletdialog.pcss'

export type Props = {
    onCancel: () => void,
    message?: string,
}

const UnlockWalletDialog = ({ onCancel, message, translate, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
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
