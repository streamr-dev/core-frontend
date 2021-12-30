// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { CoreHelmet } from '$shared/components/Helmet'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { saveCurrentUser, getUserData } from '$shared/modules/user/actions'
import Toolbar from '$shared/components/Toolbar'
import TOCPage from '$shared/components/TOCPage'
import { usePending } from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectUserData } from '$shared/modules/user/selectors'

import CoreLayout from '$shared/components/Layout/Core'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import routes from '$routes'
import ProfileSettings from './ProfileSettings'
import DeleteAccount from './DeleteAccount'

export const ProfilePage = () => {
    const { isPending: isSavePending, wrap } = usePending('user.SAVE')
    const { isPending: isDeleteAccountPending } = usePending('user.DELETE_ACCOUNT')
    const { isPending: isAvatarUploadPending } = usePending('user.UPLOAD_AVATAR')
    const isMounted = useIsMounted()
    const dispatch = useDispatch()
    const history = useHistory()

    const doSaveCurrentUser = useCallback(() => dispatch(saveCurrentUser()), [dispatch])
    const redirectToUserPages = useCallback(() => history.push(routes.core()), [history])

    const onSave = useCallback(async () => (
        wrap(async () => {
            try {
                await doSaveCurrentUser()

                if (isMounted()) {
                    Notification.push({
                        title: 'Your settings have been saved',
                        icon: NotificationIcon.CHECKMARK,
                    })

                    redirectToUserPages()
                }
            } catch (e) {
                console.warn(e)

                Notification.push({
                    title: 'Save failed',
                    icon: NotificationIcon.ERROR,
                })
            }
        })
    ), [wrap, doSaveCurrentUser, redirectToUserPages, isMounted])

    const isLoading = !!(
        isSavePending ||
        isDeleteAccountPending ||
        isAvatarUploadPending
    )

    return (
        <CoreLayout
            nav={false}
            navComponent={(
                <Toolbar
                    altMobileLayout
                    loading={isLoading}
                    actions={{
                        cancel: {
                            title: 'Cancel',
                            kind: 'link',
                            linkTo: routes.core(),
                        },
                        saveChanges: {
                            title: 'Save & Exit',
                            kind: 'primary',
                            onClick: onSave,
                            disabled: isSavePending,
                            spinner: isSavePending,
                        },
                    }}
                />
            )}
        >
            <CoreHelmet title="Profile" />
            <TOCPage title="Settings">
                <TOCPage.Section id="profile" title="Profile">
                    <ProfileSettings />
                </TOCPage.Section>
                <TOCPage.Section
                    id="delete-account"
                    title="Delete Streamr Account"
                    linkTitle="Delete account"
                >
                    <DeleteAccount />
                </TOCPage.Section>
            </TOCPage>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <CoreLayout
        nav={false}
        navComponent={(
            <Toolbar
                loading
                actions={{}}
                altMobileLayout
            />
        )}
    />
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
