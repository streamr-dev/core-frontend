// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { saveCurrentUser, getUserData } from '$shared/modules/user/actions'
import Toolbar from '$shared/components/Toolbar'
import TOCPage from '$shared/components/TOCPage'
import links from '$shared/../links'
import { usePending } from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectUserData } from '$shared/modules/user/selectors'

import Layout from '$shared/components/Layout'
import CoreLayout from '$shared/components/Layout/Core'
import ProfileSettings from './ProfileSettings'
import APICredentials from './APICredentials'
import IntegrationKeyHandler from './IntegrationKeyHandler'
import IdentityHandler from './IdentityHandler/index'
import DeleteAccount from './DeleteAccount'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import styles from './profilePage.pcss'
import routes from '$routes'

export const ProfilePage = () => {
    const { isPending: isSavePending, wrap } = usePending('user.SAVE')
    const { isPending: isApiCredentialsPending } = usePending('user.API_CREDENTIALS')
    const { isPending: isAddIdentityPending } = usePending('user.ADD_IDENTITY')
    const { isPending: isAddPrivateKeyPending } = usePending('user.ADD_PRIVATE_KEY')
    const { isPending: isDeleteAccountPending } = usePending('user.DELETE_ACCOUNT')
    const { isPending: isChangePasswordPending } = usePending('user.CHANGE_PASSWORD')
    const { isPending: isAvatarUploadPending } = usePending('user.UPLOAD_AVATAR')
    const isMounted = useIsMounted()
    const dispatch = useDispatch()

    const doSaveCurrentUser = useCallback(() => dispatch(saveCurrentUser()), [dispatch])
    const redirectToUserPages = useCallback(() => dispatch(push(routes.userPages())), [dispatch])

    const onSave = useCallback(async () => (
        wrap(async () => {
            try {
                await doSaveCurrentUser()

                if (isMounted()) {
                    Notification.push({
                        title: I18n.t('userpages.profilePage.save.successNotification'),
                        icon: NotificationIcon.CHECKMARK,
                    })

                    redirectToUserPages()
                }
            } catch (e) {
                console.warn(e)

                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
            }
        })
    ), [wrap, doSaveCurrentUser, redirectToUserPages, isMounted])

    const isLoading = !!(
        isSavePending ||
        isApiCredentialsPending ||
        isAddIdentityPending ||
        isAddPrivateKeyPending ||
        isDeleteAccountPending ||
        isChangePasswordPending ||
        isAvatarUploadPending
    )

    return (
        <CoreLayout
            hideNavOnDesktop
            navComponent={(
                <Toolbar
                    altMobileLayout
                    actions={{
                        cancel: {
                            title: I18n.t('userpages.profilePage.toolbar.cancel'),
                            kind: 'link',
                            linkTo: links.userpages.main,
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                            kind: 'primary',
                            onClick: onSave,
                            disabled: isSavePending,
                            spinner: isSavePending,
                        },
                    }}
                />
            )}
            loading={isLoading}
            loadingClassname={styles.loadingIndicator}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.profile')}`} />
            <TOCPage title={I18n.t('userpages.profilePage.pageTitle')}>
                <TOCPage.Section id="profile" title={I18n.t('userpages.profilePage.profile.title')}>
                    <ProfileSettings />
                </TOCPage.Section>
                <TOCPage.Section
                    id="ethereum-accounts"
                    title={I18n.t('userpages.profilePage.ethereumAddress.title')}
                    linkTitle={I18n.t('userpages.profilePage.ethereumAddress.linkTitle')}
                >
                    <IdentityHandler />
                </TOCPage.Section>
                <TOCPage.Section
                    id="private-keys"
                    title={I18n.t('userpages.profilePage.ethereumPrivateKeys.title')}
                    linkTitle={I18n.t('userpages.profilePage.ethereumPrivateKeys.linkTitle')}
                >
                    <IntegrationKeyHandler />
                </TOCPage.Section>
                <TOCPage.Section
                    id="api-keys"
                    title={I18n.t('userpages.profilePage.apiCredentials.title')}
                    linkTitle={I18n.t('userpages.profilePage.apiCredentials.linkTitle')}
                >
                    <APICredentials />
                </TOCPage.Section>
                <TOCPage.Section
                    id="delete-account"
                    title={I18n.t('userpages.profilePage.deleteAccount.title')}
                    linkTitle={I18n.t('userpages.profilePage.deleteAccount.linkTitle')}
                >
                    <DeleteAccount />
                </TOCPage.Section>
            </TOCPage>
        </CoreLayout>
    )
}

const StyledLoadingIndicator = styled(LoadingIndicator)`
  top: 2px;
`

const LoadingView = () => (
    <Layout>
        <StyledLoadingIndicator loading />
    </Layout>
)

const ProfileWrap = () => {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    const hasUser = !!user
    const [userLoaded, setUserLoaded] = useState(false)

    const getCurrentUser = useCallback(() => {
        dispatch(getUserData())
    }, [dispatch])

    useEffect(() => {
        if (!hasUser && !userLoaded) {
            getCurrentUser()
            setUserLoaded(true)
        }
    }, [hasUser, userLoaded, getCurrentUser])

    if (!user) {
        return <LoadingView />
    }

    const key = (!!user && user.username) || ''

    return (
        <ProfilePage key={key} />
    )
}

export default () => (
    <PendingProvider name="profile">
        <ProfileWrap />
    </PendingProvider>
)
