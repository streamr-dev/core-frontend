// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import PngIcon from '$shared/components/PngIcon'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import styles from './insufficientDataDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InsufficientDataDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.insufficientDataDialog.title')}
            onClose={onCancel}
        >
            <PngIcon
                className={styles.icon}
                name="walletNoData"
                alt={I18n.t('modal.insufficientDataDialog.title')}
            />
            <Translate tag="p" dangerousHTML value="modal.insufficientDataDialog.message" className={styles.message} />
        </Dialog>
    </ModalPortal>
)

export default InsufficientDataDialog
