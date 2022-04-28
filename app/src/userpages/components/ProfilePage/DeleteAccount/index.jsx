// @flow

import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { logout } from '$shared/modules/user/actions'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { MD, LG } from '$shared/utils/styled'
import { setupSession } from '$shared/reducers/session'
import routes from '$routes'
import Description from '../Description'
import DeleteAccountDialog from './DeleteAccountDialog'

const RemoveButton = styled(Button)`
    @media (min-width: ${MD}px) {
        margin-top: 3.75rem;
    }

    @media (min-width: ${LG}px) {
        margin-top: 3rem;
    }
`

const DeleteAccount = () => {
    const { api: deleteAccountDialog, isOpen } = useModal('userpages.deleteAccount')
    const { wrap, isPending: isDeleteDialogPending } = usePending('user.DELETE_ACCOUNT_DIALOG')
    const { isPending: isSavePending } = usePending('user.SAVE')
    const dispatch = useDispatch()
    const history = useHistory()
    const isMounted = useIsMounted()

    const deleteAccount = useCallback(async () => (
        wrap(async () => {
            const { deleted, error } = await deleteAccountDialog.open()

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: 'Account not disabled',
                        icon: NotificationIcon.ERROR,
                    })
                } else if (deleted) {
                    Notification.push({
                        title: 'Account disabled!',
                        icon: NotificationIcon.CHECKMARK,
                    })
                    setTimeout(() => {
                        if (isMounted()) {
                            dispatch(logout())
                            dispatch(setupSession([]))
                            history.push(routes.root())
                        }
                    }, 500)
                }
            }
        })
    ), [wrap, deleteAccountDialog, isMounted, dispatch, history])

    return (
        <div>
            <Description>
                Unlike other companies that deactivate your account but retain your data,
                {' '}
                if you delete your Streamr account, all your data is deleted from our servers and will be unrecoverable.
                {' '}
                Please proceed with caution.
            </Description>
            <RemoveButton
                kind="destructive"
                onClick={deleteAccount}
                disabled={isOpen || isSavePending}
                aria-label="Delete account"
                waiting={isDeleteDialogPending}
            >
                Delete account
            </RemoveButton>
            <DeleteAccountDialog />
        </div>
    )
}

export default DeleteAccount
