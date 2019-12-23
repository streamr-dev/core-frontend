// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ExternalLinkButton from '$shared/components/Buttons/ExternalLinkButton'

import styles from './installMobileApplicationDialog.pcss'

export type Props = {
    onClose: () => void,
}

const InstallMobileApplicationDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={I18n.t('modal.web3.installmobileapplication.title')}
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
    </ModalPortal>
)

export default InstallMobileApplicationDialog
