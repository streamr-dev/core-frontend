import React, { useCallback, useState, useRef, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { useTransition, animated } from 'react-spring'
import styled from 'styled-components'

import useIsMounted from '$shared/hooks/useIsMounted'
import SelectInput from '$ui/Select'
import Label from '$ui/Label'
import Button from '$shared/components/Button'
import Sidebar from '$shared/components/Sidebar'
import { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import useUniqueId from '$shared/hooks/useUniqueId'

import * as State from './state'
import styles from './ShareSidebar.pcss'
import CopyLink from './CopyLink'
import InputNewShare from './InputNewShare'
import UserPermissions from './UserPermissions'
import useAsyncCallbackWithState from './hooks/useAsyncCallbackWithState'
import usePrevious from './hooks/usePrevious'
import useSlideIn from './hooks/useSlideIn'
import useUserPermissionState from './hooks/useUserPermissionState'
import usePermissionsLoader from './hooks/usePermissionsLoader'
import savePermissions from './utils/savePermissions'

const options = ['onlyInvited', 'withLink']

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

const UnstyledShareSidebar = connect(({ user, ...props }) => ({
    currentUser: user && user.user && user.user.username,
}))((props) => {
    const { currentUser, resourceType, resourceId, onClose } = props
    const isMounted = useIsMounted()
    const propsRef = useRef(props)
    propsRef.current = props
    const { userErrors, setUserErrors } = props

    const {
        permissions,
        currentUsers,
        canShareToUser,
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
    const { addTransitionCheck, removeTransitionCheck } = useContext(SidebarContext)

    // true if sidebar can close safely without cancel
    const checkCanClose = useCallback(() => {
        if (!hasChanges) { return true }
        if (shouldForceCloseRef.current) { return true }
        setDidTryClose(true)
        if (isSaving) { return false }
        return false
    }, [hasChanges, isSaving, setDidTryClose])

    // block closing sidebar unless checkCanClose passes
    useEffect(() => {
        addTransitionCheck(checkCanClose)
        return () => removeTransitionCheck(checkCanClose)
    }, [checkCanClose, addTransitionCheck, removeTransitionCheck])

    // hide 'save or cancel' warning message after change
    useEffect(() => {
        setDidTryClose(false)
    }, [setDidTryClose, currentUsers])

    // browser warning if user navigating away before saving complete
    useEffect(() => {
        if (!hasChanges && !isSaving) { return }
        window.addEventListener('beforeunload', unsavedUnloadWarning)
        return () => {
            window.removeEventListener('beforeunload', unsavedUnloadWarning)
        }
    }, [hasChanges, isSaving])

    const [bindWarningMessages, warningMessagesStyle] = useSlideIn({ isVisible: didTryClose || hasCurrentUserChanges })

    const uid = useUniqueId('ShareSidebar') // for html labels

    /* render (no hooks past here) */

    if (error) { return error.message } // this shouldn't happen

    const whoHasAccessOptions = options.map((o) => ({
        label: I18n.t(`modal.shareResource.${o}`),
        value: o,
    }))

    const anonymousPermissions = currentUsers.anonymous

    // anonymous user is not directly editable
    const editableUsers = Object.assign({}, currentUsers)
    delete editableUsers.anonymous

    // current user (own permission) is displayed on top
    let currentUserId = []

    if (editableUsers[currentUser]) {
        currentUserId = [currentUser]
    }

    // users are listed in order:
    // current user, if exists
    // new users in order added
    // old users in alphabetical order
    const oldUserIdList = Object.keys(editableUsers)
        .filter((userId) => !newUserIdList.includes(userId) && userId !== currentUser)
        .sort()

    // remove current user
    const newUserIdListFiltered = newUserIdList.filter((userId) => userId !== currentUser)

    const userEntries = [
        ...currentUserId,
        ...newUserIdListFiltered,
        ...oldUserIdList,
    ].map((userId) => [userId, editableUsers[userId]])

    // add enter/leave transitions for users
    const userEntryTransitions = useTransition(userEntries, ([userId]) => userId, {
        initial: false,
        from: {
            opacity: 0,
            willChange: 'max-height',
            maxHeight: '0px',
        },
        enter: {
            opacity: 1,
            maxHeight: '9999px',
        },
        leave: {
            opacity: 0,
            maxHeight: '0px',
        },
        config: {
            mass: 1,
            friction: 62,
            tension: 700,
            precision: 0.00001,
        },
    })

    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
        <div {...props}>
            <Sidebar.Container>
                <Label htmlFor={`${uid}AnonAccessSelect`}>
                    {I18n.t('modal.shareResource.anonymousAccess')}
                </Label>
                <SelectInput
                    inputId={`${uid}AnonAccessSelect`}
                    name="name"
                    options={whoHasAccessOptions}
                    value={anonymousPermissions.get ? whoHasAccessOptions[1] : whoHasAccessOptions[0]}
                    onChange={onAnonymousAccessChange}
                    required
                    isSearchable={false}
                    controlClassName={styles.anonSelectControl}
                />
                <InputNewShare currentUser={currentUser} onChange={addUser} canShareToUser={canShareToUser} />
            </Sidebar.Container>
            <div
                className={cx(styles.row, styles.userList)}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) { return }
                    setSelectedUserId() // select none on click background
                }}
            >
                {userEntryTransitions.map(({ item: [userId, userPermissions], props, key }) => (
                    <animated.div
                        key={key}
                        style={props}
                    >
                        <UserPermissions
                            userId={userId}
                            userPermissions={userPermissions}
                            resourceType={resourceType}
                            removeUser={removeUser}
                            updatePermission={updatePermission}
                            permissions={permissions}
                            isSelected={selectedUserId === userId}
                            isCurrentUser={currentUser === userId}
                            onSelect={setSelectedUserId}
                            error={userErrors[userId]}
                        />
                    </animated.div>
                ))}
            </div>
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
                    <div className={styles.errorMessage}>
                        {isSaving && (
                            <Translate value="modal.shareResource.warnSavingChanges" />
                        )}
                        {!isSaving && !!didTryClose && (
                            <Translate value="modal.shareResource.warnUnsavedChanges" />
                        )}
                        {!isSaving && !didTryClose && !!hasCurrentUserChanges && (
                            <Translate value="modal.shareResource.warnChangingOwnPermission" />
                        )}
                    </div>
                </div>
            </animated.div>
            <div className={cx(styles.footer, styles.row)}>
                <div className={styles.copyLink}>
                    <CopyLink
                        resourceType={resourceType}
                        resourceId={resourceId}
                    />
                </div>
                <div className={styles.saveCancelButtons}>
                    <Button onClick={onCancel} kind="link" className={styles.cancelButton}>
                        <Translate value="modal.common.cancel" />
                    </Button>
                    <Button onClick={onSave} disabled={isSaving || !hasChanges} waiting={isSaving}>
                        <Translate value="modal.shareResource.save" />
                    </Button>
                </div>
            </div>
        </div>
        /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    )
})

const ShareSidebar = styled(UnstyledShareSidebar)`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    height: 100%;
    max-height: stretch;

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
