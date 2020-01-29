// @flow

import React from 'react'
import { connect } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import withWeb3 from '$shared/utils/withWeb3'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectCreatingIdentity, selectCreatingIdentityError } from '$shared/modules/integrationKey/selectors'
import PngIcon from '$shared/components/PngIcon'
import SvgIcon from '$shared/components/SvgIcon'
import { ErrorCodes } from '$shared/errors/Web3'

import DuplicateIdentityDialog from './DuplicateIdentityDialog'

import styles from './identityChallengeDialog.pcss'

type DialogProps = {
    onClose: () => void,
}

type StateProps = {
    creatingIdentity: boolean,
    error: ?ErrorInUi,
}

type Props = DialogProps & StateProps

export const SignatureRequestDialog = ({ onClose }: DialogProps) => (
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

export const ErrorDialog = ({ onClose }: DialogProps) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.newIdentityError.defaultTitle')}
            onClose={onClose}
            actions={{
                ok: {
                    title: I18n.t('modal.common.ok'),
                    onClick: () => onClose(),
                    kind: 'primary',
                    outline: true,
                },
            }}
        >
            <div>
                <PngIcon name="walletError" className={styles.icon} />
                <Translate tag="p" value="modal.newIdentityError.description" />
            </div>
        </Dialog>
    </ModalPortal>
)

export const SuccessDialog = ({ onClose }: DialogProps) => (
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

const IdentityChallengeDialog = (props: Props) => {
    const { onClose, creatingIdentity, error } = props

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

const mapStateToProps = (state: StoreState) => ({
    creatingIdentity: selectCreatingIdentity(state),
    error: selectCreatingIdentityError(state),
})

export default withWeb3(connect(mapStateToProps)(IdentityChallengeDialog))
