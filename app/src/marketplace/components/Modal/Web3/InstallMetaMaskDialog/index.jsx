// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import WalletErrorPng from '../../../../../assets/wallet_error.png'
import WalletErrorPng2x from '../../../../../assets/wallet_error@2x.png'
import Dialog from '../../Dialog'
import withI18n from '../../../../containers/WithI18n'

import styles from './installMetaMaskDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const InstallMetaMaskDialog = ({ onCancel, translate, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={translate('modal.web3.installmetamask.title')}
        {...props}
    >
        <img className={styles.icon} src={WalletErrorPng} srcSet={`${WalletErrorPng2x} 2x`} alt="Wallet error icon" />
        <p><Translate value="modal.web3.installmetamask.message" dangerousHTML /></p>
    </Dialog>
)

export default withI18n(InstallMetaMaskDialog)
