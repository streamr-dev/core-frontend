// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import WalletNoEthPng from '$shared/assets/images/wallet_no_eth.png'
import WalletNoEthPng2x from '$shared/assets/images/wallet_no_eth@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './insufficientDaiDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InsufficientDaiDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.insufficientDaiDialog.title')}
            onClose={onCancel}
        >
            {/* TODO: Change to more DAI related no wallet IMG */}
            <img className={styles.icon} src={WalletNoEthPng} srcSet={`${WalletNoEthPng2x} 2x`} alt={I18n.t('error.wallet')} />
            <Translate value="modal.insufficientDaiDialog.message" className={styles.message} tag="p" />
        </Dialog>
    </ModalPortal>
)

export default InsufficientDaiDialog
