// @flow

import React from 'react'
import { useSelector } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { selectCreatingIdentity, selectCreatingIdentityError } from '$shared/modules/integrationKey/selectors'
import PngIcon from '$shared/components/PngIcon'
import SvgIcon from '$shared/components/SvgIcon'
import { ErrorCodes } from '$shared/errors/Web3'

import DuplicateIdentityDialog from './DuplicateIdentityDialog'

import styles from './identityChallengeDialog.pcss'

type Props = {
    onClose: () => void,
}

export const SignatureRequestDialog = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.signatureRequest.defaultTitle')}
            onClose={onClose}
        >
            <div>
                <PngIcon name="metamask" className={styles.icon} />
                <Translate tag="p" value="modal.signatureRequest.description" />
            </div>
        </Dialog>
    </ModalPortal>
)

export const ErrorDialog = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.newIdentityError.defaultTitle')}
            onClose={onClose}
        >
            <div>
                <PngIcon name="walletError" className={styles.icon} />
                <Translate tag="p" value="modal.newIdentityError.description" />
            </div>
        </Dialog>
    </ModalPortal>
)

export const SuccessDialog = ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.newIdentitySuccess.defaultTitle')}
            onClose={onClose}
        >
            <div>
                <SvgIcon name="checkmark" size="large" className={styles.icon} />
                <Translate tag="p" value="modal.newIdentitySuccess.description" />
            </div>
        </Dialog>
    </ModalPortal>
)

const IdentityChallengeDialog = ({ onClose }: Props) => {
    const creatingIdentity = useSelector(selectCreatingIdentity)
    const error = useSelector(selectCreatingIdentityError)

    if (creatingIdentity) {
        return <SignatureRequestDialog onClose={onClose} />
    }

    if (error) {
        // This probably will never be shown since the account is checked in
        // the first phase but left here just in case.
        if (error.code === ErrorCodes.IDENTITY_EXISTS) {
            return (
                <DuplicateIdentityDialog
                    onClose={onClose}
                />
            )
        }

        return (
            <ErrorDialog
                onClose={onClose}
            />
        )
    }

    return (
        <SuccessDialog
            onClose={onClose}
        />
    )
}

export default IdentityChallengeDialog
