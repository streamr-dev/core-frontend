// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import WalletErrorPng from '../../../../../../marketplace/assets/wallet_error.png'
import WalletErrorPng2x from '../../../../../../marketplace/assets/wallet_error@2x.png'
import Dialog from '../Dialog/index'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'
import ExternalLinkButton from '../../Buttons/ExternalLinkButton/index'

import styles from './getDataTokensDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const GetDataTokensDialog = ({ onCancel, translate }: Props) => (
    <Dialog
        title={translate('modal.getDataTokensDialog.title')}
        onClose={onCancel}
    >
        <img className={styles.icon} src={WalletErrorPng} srcSet={`${WalletErrorPng2x} 2x`} alt="Wallet error icon" />
        <Translate value="modal.getDataTokensDialog.message" className={styles.message} />

        <div className={styles.buttonContainer}>
            <ExternalLinkButton
                textI18nKey="modal.getDataTokensDialog.link.bancor"
                href="https://www.bancor.network/"
                className={styles.button}
            />
        </div>
    </Dialog>
)

export default withI18n(GetDataTokensDialog)
