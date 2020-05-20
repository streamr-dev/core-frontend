// @flow

import React, { useEffect, useCallback } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import IntegrationKeyList from '../IntegrationKeyHandler/IntegrationKeyList'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { usePending } from '$shared/hooks/usePending'

import profileStyles from '../profilePage.pcss'

import AddIdentityDialog from './AddIdentityDialog'

const Wrapper = styled.div`
    > button + button {
        margin-left: 1rem;
    }
`

const IdentityHandler = () => {
    const {
        load,
        ethereumIdentities,
        remove,
        edit,
        fetching,
    } = useEthereumIdentities()
    const { api: addIdentityDialog, isOpen } = useModal('userpages.addIdentity')
    const isMounted = useIsMounted()
    const { isPending: isSavePending } = usePending('user.SAVE')
    const { wrap, isPending: isAddIdentityDialogPending } = usePending('user.ADD_IDENTITY_DIALOG')
    const { wrap: wrapIdentityAction } = usePending('user.ADD_IDENTITY')

    const wrappedEdit = useCallback(async (...args) => (
        wrapIdentityAction(async () => {
            await edit(...args)
        })
    ), [wrapIdentityAction, edit])

    const wrappedRemove = useCallback(async (...args) => (
        wrapIdentityAction(async () => {
            await remove(...args)
        })
    ), [wrapIdentityAction, remove])

    const addIdentity = useCallback(async (createAccount: boolean = false) => (
        wrap(async () => {
            const { added, error } = await addIdentityDialog.open({
                createAccount,
            })

            if (isMounted()) {
                if (error) {
                    Notification.push({
                        title: I18n.t('modal.newIdentity.errorNotification'),
                        icon: NotificationIcon.ERROR,
                        error,
                    })
                } else if (added) {
                    Notification.push({
                        title: I18n.t('modal.newIdentity.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                }
            }
        })
    ), [wrap, addIdentityDialog, isMounted])

    useEffect(() => {
        load()
    }, [load])

    const isDisabled = !!(fetching || isSavePending || isAddIdentityDialogPending)

    return (
        <Wrapper>
            <Translate
                tag="p"
                value="userpages.profilePage.ethereumAddress.description"
                className={profileStyles.longText}
            />
            <IntegrationKeyList
                onDelete={wrappedRemove}
                onEdit={wrappedEdit}
                integrationKeys={ethereumIdentities || []}
                truncateValues
                className={profileStyles.keyList}
                disabled={isDisabled}
            />
            <Button
                type="button"
                kind="secondary"
                disabled={isOpen || isDisabled}
                onClick={() => addIdentity()}
                waiting={isAddIdentityDialogPending}
            >
                <Translate value="userpages.profilePage.ethereumAddress.connectWallet" />
            </Button>
            <Button
                type="button"
                kind="secondary"
                disabled={isOpen || isDisabled}
                onClick={() => addIdentity(true)}
                waiting={isAddIdentityDialogPending}
            >
                <Translate value="userpages.profilePage.ethereumAddress.createAccount" />
            </Button>
            <AddIdentityDialog />
        </Wrapper>
    )
}

export default IdentityHandler
