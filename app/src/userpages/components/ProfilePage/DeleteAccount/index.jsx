// @flow

import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'

import profileStyles from '../profilePage.pcss'

import DeleteAccountDialog from './DeleteAccountDialog'
import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { logout } from '$shared/modules/user/actions'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

const DeleteAccount = () => {
    const { api: deleteAccountDialog, isOpen } = useModal('userpages.deleteAccount')
    const { wrap, isPending: isDeleteDialogPending } = usePending('user.DELETE_ACCOUNT_DIALOG')
    const { isPending: isSavePending } = usePending('user.SAVE')
    const dispatch = useDispatch()
    const isMounted = useIsMounted()

    const deleteAccount = useCallback(async () => (
        wrap(async () => {
            const { deleted, error } = await deleteAccountDialog.open()

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: I18n.t('modal.deleteAccount.errorNotification'),
                        icon: NotificationIcon.ERROR,
                    })
                } else if (deleted) {
                    Notification.push({
                        title: I18n.t('modal.deleteAccount.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                    setTimeout(() => {
                        if (isMounted()) {
                            dispatch(logout())
                        }
                    }, 500)
                }
            }
        })
    ), [wrap, deleteAccountDialog, isMounted, dispatch])

    return (
        <div>
            <Translate value="userpages.profilePage.deleteAccount.description" tag="p" className={profileStyles.longText} />
            <div className={profileStyles.removeAccountButton}>
                <Button
                    kind="destructive"
                    onClick={deleteAccount}
                    disabled={isOpen || isSavePending}
                    aria-label={I18n.t('userpages.profilePage.deleteAccount.button')}
                    waiting={isDeleteDialogPending}
                >
                    <Translate value="userpages.profilePage.deleteAccount.button" />
                </Button>
                <DeleteAccountDialog />
            </div>
        </div>
    )
}

export default DeleteAccount
