// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import BrowserNotSupportedPng from '../../../../../assets/browser_not_supported.png'
import BrowserNotSupportedPng2x from '../../../../../assets/browser_not_supported@2x.png'
import Dialog from '../../Dialog'
import withI18n from '../../../../containers/WithI18n'
import ExternalLinkButton from '../../../Buttons/ExternalLinkButton'

import styles from './installSupportedBrowserDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const InstallSupportedBrowserDialog = ({ onCancel, translate, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={translate('modal.web3.installsupportedbrowser.title')}
        {...props}
    >
        <img className={styles.icon} src={BrowserNotSupportedPng} srcSet={`${BrowserNotSupportedPng2x} 2x`} alt="Browser not supported icon" />
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

export default withI18n(InstallSupportedBrowserDialog)
