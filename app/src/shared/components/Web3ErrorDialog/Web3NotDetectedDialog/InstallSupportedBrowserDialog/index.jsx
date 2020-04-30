// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'

import styles from '../web3NotDetectedDialog.pcss'

export type Props = {
    onClose: () => void,
}

const InstallSupportedBrowserDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={I18n.t('modal.web3.installsupportedbrowser.title')}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://brave.com"
                        target="_blank"
                    >
                        <Translate value="modal.web3.installsupportedbrowser.brave" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.google.com/chrome"
                        target="_blank"
                    >
                        <Translate value="modal.web3.installsupportedbrowser.chrome" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.mozilla.org/en-US/firefox/new"
                        target="_blank"
                    >
                        <Translate value="modal.web3.installsupportedbrowser.firefox" />
                    </Button>
                </div>
            )}
        >
            <PngIcon
                name="browserNotSupported"
                className={styles.icon}
                alt={I18n.t('modal.web3.installsupportedbrowser.imageCaption')}
            />
            <Translate value="modal.web3.installsupportedbrowser.message" tag="p" dangerousHTML className={styles.message} />
            <Translate value="modal.web3.installsupportedbrowser.mobileMessage" tag="p" dangerousHTML className={styles.mobileMessage} />
        </Dialog>
    </ModalPortal>
)

export default InstallSupportedBrowserDialog
