// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'

import styles from './deleteAccountDialog.pcss'

type Props = {
    waiting: boolean,
    onClose: () => void,
    onSave: () => void | Promise<void>,
}

const DeleteAccountDialog = ({ waiting, onClose, onSave }: Props) => (
    <Dialog
        title={I18n.t('modal.deleteAccount.defaultTitle')}
        onClose={onClose}
        actionsClassName={styles.buttons}
        actions={{
            cancel: {
                title: I18n.t('modal.common.cancel'),
                outline: true,
                onClick: onClose,
            },
            save: {
                title: I18n.t('modal.deleteAccount.save'),
                color: 'primary',
                onClick: onSave,
                className: styles.saveButton,
                disabled: waiting,
                spinner: waiting,
            },
        }}
    >
        <div>
            <Translate value="modal.deleteAccount.content" />
        </div>
    </Dialog>
)

export default DeleteAccountDialog
