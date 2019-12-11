// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import ExternalLinkButton from '$shared/components/Buttons/ExternalLinkButton'
import PngIcon from '$shared/components/PngIcon'

import styles from './installSupportedBrowserDialog.pcss'

export type Props = {
    onClose: () => void,
}

const InstallSupportedBrowserDialog = ({ onClose, ...props }: Props) => (
    <Dialog
        {...props}
        onClose={onClose}
        title={I18n.t('modal.web3.installsupportedbrowser.title')}
    >
        <PngIcon
            name="browserNotSupported"
            className={styles.icon}
            alt={I18n.t('modal.web3.installsupportedbrowser.imageCaption')}
        />
        <p><Translate value="modal.web3.installsupportedbrowser.message" dangerousHTML /></p>

        <div className={styles.buttonContainer}>
            <ExternalLinkButton
                textI18nKey="modal.web3.installsupportedbrowser.brave"
                href="https://brave.com/"
                className={styles.button}
            />
            <ExternalLinkButton
                textI18nKey="modal.web3.installsupportedbrowser.chrome"
                href="https://www.google.com/chrome/"
                className={styles.button}
            />
            <ExternalLinkButton
                textI18nKey="modal.web3.installsupportedbrowser.firefox"
                href="https://www.mozilla.org/en-US/firefox/new/"
                className={styles.button}
            />
        </div>
    </Dialog>
)

export default InstallSupportedBrowserDialog
