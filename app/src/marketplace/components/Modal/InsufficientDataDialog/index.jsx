// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import WalletNoDataPng from '$mp/assets/wallet_no_data.png'
import WalletNoDataPng2x from '$mp/assets/wallet_no_data@2x.png'
import Dialog from '$mp/components/Modal/Dialog'
import withI18n from '$mp/containers/WithI18n'

import styles from './insufficientDataDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InsufficientDataDialog = ({ onCancel }: Props) => (
    <Dialog
        title={I18n.t('modal.insufficientDataDialog.title')}
        onClose={onCancel}
    >
        <img className={styles.icon} src={WalletNoDataPng} srcSet={`${WalletNoDataPng2x} 2x`} alt={I18n.t('error.wallet')} />
        <Translate value="modal.insufficientDataDialog.message" className={styles.message} />
    </Dialog>
)

export default withI18n(InsufficientDataDialog)
