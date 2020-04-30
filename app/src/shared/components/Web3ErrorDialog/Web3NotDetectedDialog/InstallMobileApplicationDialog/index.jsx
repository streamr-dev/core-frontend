// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'

import styles from '../web3NotDetectedDialog.pcss'

export type Props = {
    onClose: () => void,
}

const InstallMobileApplicationDialog = ({ onClose, ...props }: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={I18n.t('modal.web3.installmobileapplication.title')}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://metamask.io"
                        target="_blank"
                    >
                        <Translate value="modal.web3.installsupportedbrowser.metamask" />
                    </Button>
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
                        href="https://www.opera.com/download"
                        target="_blank"
                    >
                        <Translate value="modal.web3.installsupportedbrowser.opera" />
                    </Button>
                </div>
            )}
        >
            <PngIcon
                className={styles.icon}
                name="txFailed"
                alt={I18n.t('error.txFailed')}
            />
            <Translate value="modal.web3.installmobileapplication.message" tag="p" dangerousHTML />
        </Dialog>
    </ModalPortal>
)

export default InstallMobileApplicationDialog
