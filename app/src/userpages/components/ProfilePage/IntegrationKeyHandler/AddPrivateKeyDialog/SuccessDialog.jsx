// @flow

import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './addPrivateKeyDialog.pcss'

type Props = {
    onClose: () => void,
    waiting?: boolean,
}

export const SuccessDialog = ({ onClose, waiting }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.newIdentitySuccess.defaultTitle')}
            onClose={onClose}
            waiting={waiting}
        >
            <div>
                <SvgIcon name="checkmark" size="large" className={styles.icon} />
                <Translate tag="p" value="modal.newPrivateKeySuccess.description" />
            </div>
        </Dialog>
    </ModalPortal>
)

export default SuccessDialog
