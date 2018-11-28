// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import WalletErrorPng from '../../../../assets/wallet_error.png'
import WalletErrorPng2x from '../../../../assets/wallet_error@2x.png'
import Dialog from '../../Dialog'
import withI18n from '../../../../containers/WithI18n'

import styles from './installMetaMaskDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InstallMetaMaskDialog = ({ onCancel, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={I18n.t('modal.web3.installmetamask.title')}
        {...props}
    >
        <img className={styles.icon} src={WalletErrorPng} srcSet={`${WalletErrorPng2x} 2x`} alt={I18n.t('error.wallet')} />
        <p><Translate value="modal.web3.installmetamask.message" dangerousHTML /></p>
    </Dialog>
)

export default withI18n(InstallMetaMaskDialog)
