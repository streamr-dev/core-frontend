// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import WalletNoEthPng from '$shared/assets/images/wallet_no_eth.png'
import WalletNoEthPng2x from '$shared/assets/images/wallet_no_eth@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './insufficientEthDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InsufficientEthDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.insufficientEthDialog.title')}
            onClose={onCancel}
        >
            <img className={styles.icon} src={WalletNoEthPng} srcSet={`${WalletNoEthPng2x} 2x`} alt={I18n.t('error.wallet')} />
            <Translate value="modal.insufficientEthDialog.message" className={styles.message} tag="p" dangerousHTML />
        </Dialog>
    </ModalPortal>
)

export default InsufficientEthDialog
