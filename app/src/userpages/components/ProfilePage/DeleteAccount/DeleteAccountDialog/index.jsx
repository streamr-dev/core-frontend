// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ConfirmDialog from '$shared/components/ConfirmDialog'
import ConfirmCheckbox from '$shared/components/ConfirmCheckbox'
import UseState from '$shared/components/UseState'

import styles from './deleteAccountDialog.pcss'

type Props = {
    waiting: boolean,
    onClose: () => void,
    onSave: () => void | Promise<void>,
}

const DeleteAccountDialog = ({ waiting, onClose, onSave }: Props) => (
    <UseState initialValue={false}>
        {(confirmed, setConfirmed) => (
            <ConfirmDialog
                title={I18n.t('modal.deleteAccount.defaultTitle')}
                onReject={onClose}
                onAccept={onSave}
                message={(
                    <div>
                        <Translate value="modal.deleteAccount.content" tag="p" className={styles.deleteWarning} />
                        <ConfirmCheckbox
                            title={I18n.t('modal.deleteAccount.confirmCheckbox.title')}
                            subtitle={I18n.t('modal.deleteAccount.confirmCheckbox.subtitle')}
                            onToggle={setConfirmed}
                            className={styles.confirmCheckbox}
                        />
                    </div>
                )}
                acceptButton={{
                    title: I18n.t('modal.deleteAccount.save'),
                    kind: 'destructive',
                    disabled: !confirmed,
                    spinner: waiting,
                }}
            />
        )}
    </UseState>
)

export default DeleteAccountDialog
