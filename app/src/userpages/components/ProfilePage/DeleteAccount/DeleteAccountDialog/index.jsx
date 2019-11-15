// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ConfirmDialog from '$shared/components/ConfirmDialog'

import styles from './deleteAccountDialog.pcss'

type Props = {
    waiting: boolean,
    onClose: () => void,
    onSave: () => void | Promise<void>,
}

const DeleteAccountDialog = ({ waiting, onClose, onSave }: Props) => (
    <ConfirmDialog
        title={I18n.t('modal.deleteAccount.defaultTitle')}
        onReject={onClose}
        onAccept={onSave}
        message={<Translate value="modal.deleteAccount.content" tag="p" className={styles.deleteWarning} />}
        acceptButton={{
            title: I18n.t('modal.deleteAccount.save'),
            type: 'destructive',
            disabled: waiting,
            spinner: waiting,
        }}
        centerButtons
    />
)

export default DeleteAccountDialog
