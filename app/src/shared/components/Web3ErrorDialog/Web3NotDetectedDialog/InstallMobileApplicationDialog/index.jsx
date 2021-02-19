// @flow

import React from 'react'

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
            title="No wallet found"
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://metamask.io"
                        target="_blank"
                    >
                        Metamask
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://brave.com"
                        target="_blank"
                    >
                        Brave
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.opera.com/download"
                        target="_blank"
                    >
                        Opera
                    </Button>
                </div>
            )}
        >
            <PngIcon
                className={styles.icon}
                name="txFailed"
                alt="Transaction failed"
            />
            <p>
                We couldn&apos;t find your wallet.
                <br />
                Please get one and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default InstallMobileApplicationDialog
