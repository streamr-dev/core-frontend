// @flow

import React from 'react'

import WalletPng from '../../../../assets/wallet.png'
import WalletPng2x from '../../../../assets/wallet@2x.png'
import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'

import styles from './unlockwalletdialog.pcss'

export type Props = {
    onCancel: () => void,
    message?: string,
    translate: (key: string, options: any) => string,
}

const UnlockWalletDialog = ({ onCancel, message, translate, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={translate('modal.unlockWallet.title')}
        {...props}
    >
        <img className={styles.walletIcon} src={WalletPng} srcSet={`${WalletPng2x} 2x`} alt="Wallet Icon" />
        {message && (
            <p>{message}</p>
        )}
    </Dialog>
)

export default withI18n(UnlockWalletDialog)
