// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

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
            title={I18n.t('modal.web3.installmetamask.title')}
        >
            <img className={styles.icon} src={WalletErrorPng} srcSet={`${WalletErrorPng2x} 2x`} alt={I18n.t('error.wallet')} />
            <p><Translate value="modal.web3.installmetamask.message" dangerousHTML /></p>
        </Dialog>
    </ModalPortal>
)

export default InstallMetaMaskDialog
