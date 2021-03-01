// @flow

import React from 'react'
import { useSelector } from 'react-redux'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { selectCreatingIdentity, selectCreatingIdentityError } from '$shared/modules/integrationKey/selectors'
import PngIcon from '$shared/components/PngIcon'
import { ErrorCodes } from '$shared/errors/Web3'

import styles from './identityChallengeDialog.pcss'

type Props = {
    onClose: () => void,
}

export const SignatureRequestDialog = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title="Signature request"
            onClose={onClose}
            contentClassName={styles.dialogContent}
        >
            <PngIcon
                name="metamask"
                className={styles.icon}
            />
            <p className={styles.text}>
                Please sign the challenge in MetaMask
            </p>
        </Dialog>
    </ModalPortal>
)

export const DuplicateIdentityDialog = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title="Account already connected"
            onClose={onClose}
            contentClassName={styles.dialogContent}
        >
            <PngIcon
                name="metamask"
                className={styles.icon}
            />
            <p className={styles.text}>
                This account is already connected.
                <br />
                Please choose another account from Metamask to connect.
            </p>
        </Dialog>
    </ModalPortal>
)

export const IdentityChallengeDialog = ({ onClose }: Props) => {
    const creatingIdentity = useSelector(selectCreatingIdentity)
    const error = useSelector(selectCreatingIdentityError)

    if (!creatingIdentity && error && error.code === ErrorCodes.IDENTITY_EXISTS) {
        // This probably will never be shown since the account is checked in
        // the first phase but left here just in case.
        return (
            <DuplicateIdentityDialog
                onClose={onClose}
            />
        )
    }

    return <SignatureRequestDialog onClose={onClose} />
}

export default IdentityChallengeDialog
