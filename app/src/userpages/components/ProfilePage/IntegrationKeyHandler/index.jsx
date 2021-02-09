// @flow

import React, { Fragment, useCallback, useEffect } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import usePrivateKeys from '$shared/modules/integrationKey/hooks/usePrivateKeys'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { usePending } from '$shared/hooks/usePending'
import { selectUserData } from '$shared/modules/user/selectors'
import Description from '../Description'
import IntegrationKeyList from './IntegrationKeyList'

import AddPrivateKeyDialog from './AddPrivateKeyDialog'

export const IntegrationKeyHandler = () => {
    const {
        load,
        privateKeys,
        remove,
        edit,
        fetching,
    } = usePrivateKeys()
    const { api: addPrivateKeyDialog, isOpen } = useModal('userpages.addPrivateKey')
    const isMounted = useIsMounted()
    const { wrap, isPending: isAddPrivateKeyDialogPending } = usePending('user.ADD_PRIVATE_KEY_DIALOG')
    const { wrap: wrapPrivateKeyAction } = usePending('user.ADD_PRIVATE_KEY')
    const { isPending: isSavePending } = usePending('user.SAVE')
    const user = useSelector(selectUserData)

    const wrappedEdit = useCallback(async (...args) => (
        wrapPrivateKeyAction(async () => {
            await edit(...args)
        })
    ), [wrapPrivateKeyAction, edit])

    const wrappedRemove = useCallback(async (...args) => (
        wrapPrivateKeyAction(async () => {
            await remove(...args)
        })
    ), [wrapPrivateKeyAction, remove])

    const addPrivateKey = useCallback(async () => (
        wrap(async () => {
            const { added, error } = (await addPrivateKeyDialog.open()) || {}

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: I18n.t('modal.privateKey.errorNotification'),
                        icon: NotificationIcon.ERROR,
                        error,
                    })
                } else if (added) {
                    Notification.push({
                        title: I18n.t('modal.privateKey.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                }
            }
        })
    ), [wrap, addPrivateKeyDialog, isMounted])

    useEffect(() => {
        load()
    }, [load])

    const isDisabled = !!(fetching || isSavePending || isAddPrivateKeyDialogPending)

    return (
        <Fragment>
            <Description
                value="userpages.profilePage.ethereumPrivateKeys.description"
                tag="p"
                dangerousHTML
            />
            <IntegrationKeyList
                integrationKeys={privateKeys}
                onDelete={wrappedRemove}
                onEdit={wrappedEdit}
                disabled={isDisabled}
                activeKeyId={user && user.username}
            />
            <Button
                type="button"
                kind="secondary"
                disabled={isOpen || isDisabled}
                onClick={addPrivateKey}
                waiting={isAddPrivateKeyDialogPending}
            >
                <Translate
                    value={`userpages.profilePage.ethereumPrivateKeys.${privateKeys && privateKeys[0] ? 'addAddress' : 'addNewAddress'}`}
                />
            </Button>
            <AddPrivateKeyDialog />
        </Fragment>
    )
}

export default IntegrationKeyHandler
