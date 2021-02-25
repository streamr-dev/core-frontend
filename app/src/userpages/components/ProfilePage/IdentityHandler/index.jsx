// @flow

import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import Button from '$shared/components/Button'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { usePending } from '$shared/hooks/usePending'
import { LG } from '$shared/utils/styled'
import { selectUserData } from '$shared/modules/user/selectors'
import IntegrationKeyList from '../IntegrationKeyHandler/IntegrationKeyList'

import Description from '../Description'

import AddIdentityDialog from './AddIdentityDialog'

const Wrapper = styled.div``

const ConnectButton = styled(Button)`
    && {
        display: none;
        margin-right: 1rem;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-block;
        }
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
    const { wrap: wrapConnectWalletDialog, isPending: isConnectWalletDialogPending } = usePending('user.CONNECT_WALLET_DIALOG')
    const { wrap: wrapCreateAccountDialog, isPending: isCreateAccountDialogPending } = usePending('user.CREATE_ACCOUNT_DIALOG')
    const { wrap: wrapIdentityAction } = usePending('user.ADD_IDENTITY')
    const user = useSelector(selectUserData)

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

    const addIdentity = useCallback(async (createAccount: boolean = false) => {
        const { added, error } = (await addIdentityDialog.open({
            createAccount,
        })) || {}

        if (isMounted()) {
            if (error) {
                Notification.push({
                    title: 'There was an error while adding an Ethereum address',
                    icon: NotificationIcon.ERROR,
                    error,
                })
            } else if (added) {
                Notification.push({
                    title: 'Ethereum address added',
                    icon: NotificationIcon.CHECKMARK,
                })
            }
        }
    }, [addIdentityDialog, isMounted])

    const connectWallet = useCallback(async () => (
        wrapConnectWalletDialog(async () => addIdentity())
    ), [wrapConnectWalletDialog, addIdentity])

    const createAccount = useCallback(async () => (
        wrapCreateAccountDialog(async () => addIdentity(true))
    ), [wrapCreateAccountDialog, addIdentity])

    useEffect(() => {
        load()
    }, [load])

    const isDisabled = !!(
        fetching ||
        isSavePending ||
        isConnectWalletDialogPending ||
        isConnectWalletDialogPending
    )

    return (
        <Wrapper>
            <Description>
                Ethereum accounts are used for decentralized identity, calling smart contracts,
                <br />
                and signing data in streams. Connect your wallet accounts to use them in Core
                <br />
                and Marketplace, or create new accounts to be used in scripts.
            </Description>
            <IntegrationKeyList
                onDelete={wrappedRemove}
                onEdit={wrappedEdit}
                integrationKeys={ethereumIdentities || []}
                disabled={isDisabled}
                activeKeyId={user && user.username}
            />
            <ConnectButton
                type="button"
                kind="secondary"
                disabled={isOpen || isDisabled}
                onClick={connectWallet}
                waiting={isConnectWalletDialogPending}
            >
                Connect wallet
            </ConnectButton>
            <Button
                type="button"
                kind="secondary"
                disabled={isOpen || isDisabled}
                onClick={createAccount}
                waiting={isCreateAccountDialogPending}
            >
                Create account
            </Button>
            <AddIdentityDialog />
        </Wrapper>
    )
}

export default IdentityHandler
