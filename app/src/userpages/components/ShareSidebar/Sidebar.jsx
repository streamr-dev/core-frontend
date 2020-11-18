import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { animated } from 'react-spring'
import styled from 'styled-components'

import useIsMounted from '$shared/hooks/useIsMounted'
import Label from '$ui/Label'
import Sidebar from '$shared/components/Sidebar'
import { useBeforeClose } from '$shared/components/Sidebar/SidebarProvider'
import { selectUserData } from '$shared/modules/user/selectors'

import * as State from './state'
import styles from './ShareSidebar.pcss'
import NewShareForm from './NewShareForm'
import useAsyncCallbackWithState from './hooks/useAsyncCallbackWithState'
import usePrevious from './hooks/usePrevious'
import useSlideIn from './hooks/useSlideIn'
import useUserPermissionState from './hooks/useUserPermissionState'
import usePermissionsLoader from './hooks/usePermissionsLoader'
import savePermissions from './utils/savePermissions'
import UserList from './UserList'
import Footer from './Footer'
import ErrorMessage from './ErrorMessage'
import Md from '$shared/components/Md'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import AnonAccessSelect, { ALLOW_ONLY_INVITED, ALLOW_WITH_LINK } from './AnonAccessSelect'

const UnstyledShareSidebar = (({ className, ...props }) => {
    const currentUser = (useSelector(selectUserData) || {}).username
    const { resourceType, resourceId, onClose } = props
    const isMounted = useIsMounted()
    const propsRef = useRef(props)
    propsRef.current = props
    const { userErrors, setUserErrors } = props

    const {
        permissions,
        currentUsers,
        addUser,
        removeUser,
        updatePermission,
        onAnonymousAccessChange,
        newUserIdList,
        setNewUserIdList,
        selectedUserId,
        setSelectedUserId,
    } = useUserPermissionState(props)

    // i.e. something different between server state and our state
    const hasChanges = State.hasPermissionsChanges({
        oldPermissions: permissions,
        newUsers: currentUsers,
        resourceType,
    })
    const hasCurrentUserChanges = State.hasUserSpecificPermissionsChanges({
        oldPermissions: permissions,
        newUsers: currentUsers,
        resourceType,
        targetUserId: currentUser,
    })

    // should be true when user tries to close sidebar
    const [didTryClose, setDidTryClose] = useState(false)

    /*
     * Saves permissions by:
     * issuing updates, loading latest, then restoring state of users with failed updates
     * note all happens within an useAsyncCallbackWithState so changes are blocked while saving
     */

    const [{ isLoading: isSaving, error }, onSave] = useAsyncCallbackWithState(useCallback(async () => {
        setDidTryClose(false) // hide any 'need to save' errors
        // issue permission updates
        const { errors } = await savePermissions(currentUsers, propsRef.current)
        if (!isMounted()) { return }
        // load latest permissions
        // required to set base permissions to whatever changes were successful
        await propsRef.current.loadPermissions()

        if (!isMounted()) {
            // close sidebar if permission loading failed
            propsRef.current.onClose()
            return
        }

        setUserErrors(errors) // errors will be empty if no errors
        setNewUserIdList((prevIds) => (
            // reset new user list to only include new users that had errors
            prevIds.filter((id) => Object.keys(errors).includes(id))
        ))

        // restore state of any users with failed updates
        Object.keys(errors).forEach((userId) => {
            updatePermission(userId, currentUsers[userId])
        })
    }, [isMounted, currentUsers, setUserErrors, setDidTryClose, updatePermission, setNewUserIdList]))

    const previousIsSaving = usePrevious(isSaving) // note previous isSaving state so we know when we just finished saving
    const hasUserError = !!Object.keys(userErrors).length

    // was just successful in saving users
    const isSuccessful = !!(previousIsSaving && !isSaving && !error && !hasUserError)

    const shouldForceCloseRef = useRef(false)

    // close sidebar if successful
    useEffect(() => {
        if (isSuccessful) {
            shouldForceCloseRef.current = true
            onClose()
        }
    }, [isSuccessful, onClose])

    // user clicked cancel button
    const onCancel = useCallback(() => {
        shouldForceCloseRef.current = true // use ref as we don't need to trigger render
        // no need to unset shouldForceCloseRef since cancel will lead to unmount anyway
        onClose()
    }, [onClose])

    // prevent sidebar closing if unsaved changes
    useBeforeClose(() => {
        const canClose = !hasChanges || shouldForceCloseRef.current

        if (!canClose) {
            setDidTryClose(true)
        }

        return canClose
    })

    // hide 'save or cancel' warning message after change
    useEffect(() => {
        setDidTryClose(false)
    }, [setDidTryClose, currentUsers])

    usePreventNavigatingAway('You have unsaved changes', () => hasChanges || isSaving)

    const [bindWarningMessages, warningMessagesStyle] = useSlideIn({ isVisible: didTryClose || hasCurrentUserChanges })

    /* render (no hooks past here) */

    if (error) { return error.message } // this shouldn't happen

    const anonymousPermissions = currentUsers.anonymous

    // anonymous user is not directly editable
    const editableUsers = Object.assign({}, currentUsers)
    delete editableUsers.anonymous

    const userSet = new Set([
        currentUser,
        ...newUserIdList,
        ...Object.keys(editableUsers).sort(),
    ])

    if (!editableUsers[currentUser]) {
        userSet.delete(currentUser)
    }

    const userEntries = [...userSet].map((userId) => [userId, editableUsers[userId]])

    return (
        <div className={className}>
            <Sidebar.Container>
                <AnonAccessSelect
                    onChange={onAnonymousAccessChange}
                    value={anonymousPermissions.get ? ALLOW_WITH_LINK : ALLOW_ONLY_INVITED}
                />
                <NewShareForm onAdd={addUser} />
            </Sidebar.Container>
            <UserList
                items={userEntries}
                resourceType={resourceType}
                removeUser={removeUser}
                updatePermission={updatePermission}
                permissions={permissions}
                userErrors={userErrors}
                selectedUserId={selectedUserId}
                onSelect={setSelectedUserId}
            />
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
                className={cx(styles.errorOverlay, {
                    [styles.errorOverlayVisible]: didTryClose,
                })}
                onClick={() => setDidTryClose(false)}
            />
            <animated.div
                className={styles.errorMessageWrapper}
                style={warningMessagesStyle}
            >
                {/* only shows if trying to close with unsaved changes */}
                <div {...bindWarningMessages}>
                    <Sidebar.Container as={ErrorMessage}>
                        {isSaving && (
                            <Translate value="modal.shareResource.warnSavingChanges" />
                        )}
                        {!isSaving && !!didTryClose && (
                            <Md inline>
                                {I18n.t('modal.shareResource.warnUnsavedChanges')}
                            </Md>
                        )}
                        {!isSaving && !didTryClose && !!hasCurrentUserChanges && (
                            <Translate value="modal.shareResource.warnChangingOwnPermission" />
                        )}
                    </Sidebar.Container>
                </div>
            </animated.div>
            <Sidebar.Container
                as={Footer}
                disabled={isSaving || !hasChanges}
                onCancel={onCancel}
                onSave={onSave}
                resourceId={resourceId}
                resourceType={resourceType}
                waiting={isSaving}
            />
        </div>
    )
})

const ShareSidebar = styled(UnstyledShareSidebar)`
    color: #323232;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    height: 100%;
    max-height: stretch;

    ${NewShareForm} ${Label},
    * + ${Label} {
        margin-top: 16px;
    }
`

export default (props) => {
    const { resourceType, resourceId } = props

    const [{ isLoading, error, result: permissions }, loadPermissions] = usePermissionsLoader({
        resourceType,
        resourceId,
    })

    const [userErrors, setUserErrors] = useState({})

    if (!permissions) { return null }

    return (
        <ShareSidebar
            {...props}
            isLoading={isLoading}
            error={error}
            permissions={permissions}
            loadPermissions={loadPermissions}
            userErrors={userErrors}
            setUserErrors={setUserErrors}
        />
    )
}
