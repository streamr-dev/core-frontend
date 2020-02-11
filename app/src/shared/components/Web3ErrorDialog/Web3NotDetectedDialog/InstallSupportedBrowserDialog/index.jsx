// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'
import { isMobile } from '$shared/utils/platform'

import styles from './installSupportedBrowserDialog.pcss'

export type Props = {
    onClose: () => void,
}

const dialogText = () => {
    if (isMobile()) {
        return 'modal.web3.installsupportedbrowser.mobileMessage'
    }
    return 'modal.web3.installsupportedbrowser.message'
}

const InstallSupportedBrowserDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
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
            <p><Translate value={dialogText()} dangerousHTML /></p>

            <div className={styles.buttonContainer}>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://brave.com"
                    target="_blank"
                >
                    <Translate value="modal.web3.installsupportedbrowser.brave" />
                </Button>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://www.google.com/chrome"
                    target="_blank"
                >
                    <Translate value="modal.web3.installsupportedbrowser.chrome" />
                </Button>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://www.mozilla.org/en-US/firefox/new"
                    target="_blank"
                >
                    <Translate value="modal.web3.installsupportedbrowser.firefox" />
                </Button>
            </div>
        </Dialog>
    </ModalPortal>
)

export default InstallSupportedBrowserDialog
