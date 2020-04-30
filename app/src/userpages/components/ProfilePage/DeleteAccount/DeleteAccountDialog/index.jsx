// @flow

import React, { useState, useCallback } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { useDispatch } from 'react-redux'

import ConfirmDialog from '$shared/components/ConfirmDialog'
import ConfirmCheckbox from '$shared/components/ConfirmCheckbox'
import { deleteUserAccount } from '$shared/modules/user/actions'
import usePending from '$shared/hooks/usePending'
import useModal from '$shared/hooks/useModal'

import styles from './deleteAccountDialog.pcss'

type Props = {
    waiting?: boolean,
    onClose: () => void,
    onSave: () => void | Promise<void>,
}

export const DeleteAccountDialogComponent = ({ waiting, onClose, onSave }: Props) => {
    const [confirmed, setConfirmed] = useState(false)

    return (
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
                        disabled={!!waiting}
                    />
                </div>
            )}
            acceptButton={{
                title: I18n.t('modal.deleteAccount.save'),
                kind: 'destructive',
                disabled: !confirmed || !!waiting,
                spinner: !!waiting,
            }}
        />
    )
}

type ContainerProps = {
    api: Object,
}

const DeleteAccountDialog = ({ api }: ContainerProps) => {
    const { isPending, wrap } = usePending('user.DELETE_ACCOUNT')
    const dispatch = useDispatch()

    const onSave = useCallback(async () => (
        wrap(async () => {
            let deleted = false
            let error
            try {
                await dispatch(deleteUserAccount())
                deleted = true
            } catch (e) {
                console.warn(e)
                error = e
            } finally {
                api.close({
                    deleted,
                    error,
                })
            }
        })
    ), [dispatch, wrap, api])

    const onClose = useCallback(() => {
        api.close({
            deleted: false,
            error: undefined,
        })
    }, [api])

    return (
        <DeleteAccountDialogComponent
            onClose={onClose}
            onSave={onSave}
            waiting={isPending}
        />
    )
}

export default () => {
    const { api, isOpen } = useModal('userpages.deleteAccount')

    if (!isOpen) {
        return null
    }

    return (
        <DeleteAccountDialog
            api={api}
        />
    )
}
