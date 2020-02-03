// @flow

import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'

import styles from '../identityChallengeDialog.pcss'

type Props = {
    onClose: () => void,
}

export default ({ onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.duplicateIdentity.defaultTitle')}
            onClose={onClose}
        >
            <div>
                <PngIcon name="metamask" className={styles.icon} />
                <Translate tag="p" value="modal.duplicateIdentity.description" dangerousHTML />
            </div>
        </Dialog>
    </ModalPortal>
)
