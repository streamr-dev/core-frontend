// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import ExternalLinkButton from '$shared/components/Buttons/ExternalLinkButton'

import styles from './installMobileApplicationDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InstallMobileApplicationDialog = ({ onCancel, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={I18n.t('modal.web3.installmobileapplication.title')}
        {...props}
    >
        <p><Translate value="modal.web3.installmobileapplication.message" dangerousHTML /></p>

        <div className={styles.buttonContainer}>
            <ExternalLinkButton
                textI18nKey="modal.web3.installmobileapplication.app.trust"
                href="https://trustwalletapp.com/"
                className={styles.button}
            />
            <ExternalLinkButton
                textI18nKey="modal.web3.installmobileapplication.app.toshi"
                href="https://www.toshi.org/"
                className={styles.button}
            />
        </div>
    </Dialog>
)

export default InstallMobileApplicationDialog
