// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'

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
            <PngIcon
                className={styles.icon}
                name="txFailed"
                alt={I18n.t('error.txFailed')}
            />
            <p><Translate value="modal.web3.installmobileapplication.message" dangerousHTML /></p>
            <div className={styles.buttonContainer}>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://metamask.io"
                    target="_blank"
                >
                    <Translate value="modal.web3.installsupportedbrowser.metamask" />
                </Button>
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
                    href="https://www.opera.com/download"
                    target="_blank"
                >
                    <Translate value="modal.web3.installsupportedbrowser.opera" />
                </Button>
            </div>
        </Dialog>
    </ModalPortal>
)

export default InstallMobileApplicationDialog
