import path from 'path'

import React, { useCallback, useState, useRef, useEffect, useMemo, useContext, useReducer } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import { useSpring, useTransition, animated } from 'react-spring'

import * as api from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'
import SelectInput from '$ui/Select'
import RadioButtonGroup from './RadioButtonGroup'
import Button from '$shared/components/Button'
import { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import Checkbox from '$shared/components/Checkbox'
import SvgIcon from '$shared/components/SvgIcon'
import useUniqueId from '$shared/hooks/useUniqueId'
import TextInput from '$ui/Text'
import { isFormElement } from '$shared/utils/isEditableElement'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

import * as State from './state'
import styles from './ShareSidebar.pcss'
import useMeasure from './useMeasure'
import CopyLink from './CopyLink'

const options = ['onlyInvited', 'withLink']

const getApiUrl = (resourceType, resourceId) => {
    const urlPartsByResourceType = {
        DASHBOARD: 'dashboards',
        CANVAS: 'canvases',
        STREAM: 'streams',
    }
    const urlPart = urlPartsByResourceType[resourceType]
    if (!urlPart) {
        throw new Error(`Invalid resource type: ${resourceType}`)
    }

    return `${process.env.STREAMR_API_URL}/${path.join(urlPart, resourceId)}`
}

const getResourcePermissions = async ({ resourceType, resourceId }) => api.get({
    url: `${getApiUrl(resourceType, resourceId)}/permissions`,
})

const setResourcePermission = async ({ resourceType, resourceId, data }) => api.post({
    url: `${getApiUrl(resourceType, resourceId)}/permissions`,
    data,
})

const removeResourcePermission = async ({ resourceType, resourceId, data }) => api.del({
    url: `${getApiUrl(resourceType, resourceId)}/permissions/${data.id}`,
    data,
})

function useAsyncCallbackWithState(callback) {
    const [state, setState] = useState({
        hasStarted: false,
        isLoading: false,
        error: undefined,
        result: undefined,
    })

    const isMounted = useIsMounted()
    const { isLoading } = state

    const run = useCallback(async () => {
        let error
        let result
        if (!isMounted()) { return }
        if (isLoading) { return } // already loading

        setState({
            isLoading: true,
            hasStarted: true,
        })

        try {
            result = await callback()
        } catch (err) {
            error = err
        } finally {
            // only do something if mounted
            if (isMounted()) {
                setState({
                    error,
                    result,
                    isLoading: false,
                    hasStarted: true,
                })
            }
        }
    }, [isLoading, isMounted, callback])
    return [state, run]
}

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

/**
 * Transitions element from height: 0 to measured height.
 */

function useSlideIn({ isVisible } = {}) {
    isVisible = !!isVisible
    const previousIsVisible = !!usePrevious(isVisible)

    const [bind, { height }] = useMeasure() // attach bind to element to measure
    const justChanged = previousIsVisible !== isVisible

    const targetHeight = isVisible ? height : 0
    const selectedHeight = targetHeight

    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    useEffect(() => {
        if (justChanged) {
            // needs second render to perform transition correctly
            forceUpdate()
        }
    }, [justChanged, forceUpdate])

    const style = useSpring({
        height: selectedHeight,
        config: {
            mass: 1,
            friction: 62,
            tension: 700,
            precision: 0.00001,
        },
    })

    return [bind, style]
}

/**
 * Input for adding new users.
 */

function InputNewShare({ onChange, canShareToUser }) {
    const [value, setValue] = useState('')
    const onChangeValue = useCallback((e) => {
        setValue(e.target.value.trim())
    }, [setValue])
    const onAdd = useCallback(() => {
        onChange(value)
        setValue('')
    }, [value, onChange])
    const uid = useUniqueId('InputNewShare')

    return (
        <div className={styles.InputNewShare}>
            <label htmlFor={uid}>{I18n.t('auth.labels.address')}</label>
            <TextInput
                id={uid}
                className={styles.input}
                placeholder={I18n.t('modal.shareResource.enterEmailAddress')}
                value={value}
                onChange={onChangeValue}
                autoComplete="email"
            />
            <Button
                kind="secondary"
                onClick={onAdd}
                disabled={!canShareToUser(value)}
                className={styles.button}
            >
                <SvgIcon name="plus" className={styles.plusIcon} />
            </Button>
        </div>
    )
}

/**
 * Individual User's Permissions UI
 */

function UserPermissions({
    resourceType,
    userId,
    userPermissions,
    updatePermission,
    removeUser,
    className,
    onSelect,
    isSelected,
    error,
}) {
    const selectedGroupName = State.findPermissionGroupName(resourceType, userPermissions)
    // custom handling:
    // if user edits permissions after clicking a preset, preset will be set to custom (if config doesn't match another preset)
    // when user actively clicks the custom tab, it will use whatever permissions were currently set

    const isCustom = State.isCustom(resourceType, selectedGroupName, userPermissions)

    const [bind, permissionControlsStyle] = useSlideIn({ isVisible: isSelected })

    const permissionGroupOptions = Object.keys(State.getPermissionGroups(resourceType)).filter((name) => name !== 'default')

    const onClick = useCallback((event) => {
        if (isFormElement(event.target)) { return }
        // toggle open state
        if (isSelected) {
            return onSelect()
        }
        onSelect(userId)
    }, [isSelected, onSelect, userId])

    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
        <div
            className={cx(styles.userPermissions, className, {
                [styles.isSelected]: isSelected,
            })}
            onClick={onClick}
        >
            <div className={styles.permissionsHeader}>
                <div className={styles.permissionsHeaderTitle}>
                    <h4 title={userId}>{userId}</h4>
                    <div
                        className={cx(styles.selectedGroup, {
                            [styles.isCustom]: isCustom,
                        })}
                    >
                        {isCustom ? 'Custom' : startCase(selectedGroupName)}
                    </div>
                </div>
                <DropdownActions
                    title={<Meatball />}
                    noCaret
                    toggleProps={{
                        onClick: (event) => event.stopPropagation(),
                    }}
                    menuProps={{
                        modifiers: {
                            offset: {
                                // Make menu aligned to the right.
                                // See https://popper.js.org/popper-documentation.html#modifiers..offset
                                offset: '-100%p + 100%',
                            },
                        },
                    }}
                >
                    <DropdownActions.Item
                        onClick={(event) => {
                            event.stopPropagation()
                            removeUser(userId)
                        }}
                    >
                        Remove
                    </DropdownActions.Item>
                </DropdownActions>
            </div>
            <animated.div className={styles.permissionControls} style={permissionControlsStyle}>
                <div {...bind}>
                    <RadioButtonGroup
                        name={`UserPermissions${userId}`}
                        className={cx(styles.groupSelector, {
                            [styles.isSelected]: isSelected,
                        })}
                        options={permissionGroupOptions}
                        onChange={(name) => {
                            updatePermission(userId, State.getPermissionsForGroupName(resourceType, name))
                        }}
                        selectedOption={selectedGroupName}
                        isCustom={isCustom}
                    />
                    <div className={styles.permissionsCheckboxes}>
                        {Object.entries(userPermissions).map(([permission, value]) => (
                            <React.Fragment key={permission}>
                                <Checkbox
                                    className={styles.checkbox}
                                    id={`permission${permission}`}
                                    value={value}
                                    onChange={() => updatePermission(userId, {
                                        [permission]: !value,
                                    })}
                                />
                                <label htmlFor={`permission${permission}`}>
                                    {startCase(permission)}
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </animated.div>
            {error && (
                <div className={styles.errorMessage}>
                    {error.message}
                </div>
            )}
        </div>
    )
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
}

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

/*
 * Store update errors against user.
 * Simple { [userid]: Error } mapping.
 * Nothing special.
 */

function useUserErrors() {
    const [userErrors, setUserErrors] = useState({})

    const setUserUpdateError = useCallback((userId, err) => {
        setUserErrors((prevUserErrors) => ({
            ...prevUserErrors,
            [userId]: err,
        }))
    }, [setUserErrors])

    const resetUserUpdateError = useCallback((userId) => {
        setUserErrors((prevUserErrors) => {
            const nextErrors = Object.assign({}, prevUserErrors)
            delete nextErrors[userId]
            return nextErrors
        })
    }, [setUserErrors])

    const hasUserError = Object.values(userErrors).some((v) => v)

    return {
        userErrors,
        setUserUpdateError,
        resetUserUpdateError,
        hasUserError,
    }
}

const ShareSidebar = connect(({ user }) => ({
    currentUser: user && user.user && user.user.username,
}))((props) => {
    const { currentUser, resourceType, resourceId, onClose } = props

    let { permissions } = props

    // convert permission.anonymous to permission.user = 'anonymous', if needed
    permissions = useMemo(() => permissions.map((p) => State.fromAnonymousPermission(p)), [permissions])

    const propsRef = useRef(props)
    propsRef.current = props
    const whoHasAccessOptions = options.map((o) => ({
        label: I18n.t(`modal.shareResource.${o}`),
        value: o,
    }))

    const users = useMemo(() => State.usersFromPermissions(resourceType, permissions), [resourceType, permissions])

    const [currentUsers, setCurrentUsers] = useState(users) // state of user permissions to save to server
    const [newUserIdList, setNewUserIdList] = useState([]) // users added since last save
    const [selectedUserId, setSelectedUserId] = useState() // currently selected user

    const canShareToUser = useCallback((userId) => (
        // don't interfere with anonymous/current user
        State.canShareToUser({
            currentUser,
            userId,
        })
    ), [currentUser])

    const addUser = useCallback((userId) => {
        if (!canShareToUser(userId)) { return }
        setSelectedUserId(userId) // select new user on add
        setCurrentUsers((prevUsers) => (
            State.addUser(prevUsers, userId, State.getPermissionsForGroupName(resourceType, 'default'))
        ))
        // add/move user to start of new users. Remove before adding to start if already in array
        setNewUserIdList((ids) => [userId, ...ids.filter((id) => id !== userId)])
    }, [setCurrentUsers, canShareToUser, resourceType])

    const removeUser = useCallback((userId) => {
        if (!canShareToUser(userId)) { return }
        setNewUserIdList((ids) => ids.filter((id) => id !== userId)) // remove user from new users list
        setCurrentUsers((prevUsers) => State.removeUser(prevUsers, userId))
    }, [setCurrentUsers, canShareToUser])

    const updatePermission = useCallback((userId, permissions) => {
        setCurrentUsers((prevUsers) => State.updatePermission(prevUsers, userId, permissions))
    }, [setCurrentUsers])

    // 'who has access' handler
    const onAnonymousAccessChange = useCallback(({ value }) => {
        const permissions = value === 'withLink'
            ? State.getPermissionsForGroupName(resourceType, 'default')
            : State.getEmptyPermissions(resourceType) // i.e. remove all permissions for anonymous
        updatePermission('anonymous', permissions)
    }, [updatePermission, resourceType])

    const hasChanges = State.hasPermissionsChanges({
        oldPermissions: permissions,
        newUsers: currentUsers,
        resourceType,
    })

    useEffect(() => {
        if (!hasChanges) { return }
        // warn if user navigating away before saving
        window.addEventListener('beforeunload', unsavedUnloadWarning)
        return () => {
            window.removeEventListener('beforeunload', unsavedUnloadWarning)
        }
    }, [hasChanges])

    const [didTryClose, setDidTryClose] = useState(false) // should be true when user tries to close sidebar

    const isMounted = useIsMounted()
    const { userErrors, setUserUpdateError, resetUserUpdateError, hasUserError } = useUserErrors()

    /*
     * big horrible async handler for updating permission records
     * each permission that was added needs to send a request that it be created
     * each permission that was removed added needs to send a request that it be removed
     * Issues all requests in parallel, should not abort if one fails.
     */

    const onSaveCallback = useCallback(async () => {
        setDidTryClose(false)
        const { added, removed } = State.diffUsersPermissions({
            oldPermissions: permissions,
            newUsers: currentUsers,
            resourceType,
        })

        const allChangedUserIds = [
            ...new Set([
                ...added.map(({ user }) => user),
                ...removed.map(({ user }) => user),
            ]),
        ]
        await Promise.all(allChangedUserIds.map(async (userId) => {
            const userAddedItems = added.filter((p) => p.user === userId)
            const userRemovedItems = removed.filter((p) => p.id != null && p.user === userId)
            let hasError = false
            await Promise.all([
                ...userAddedItems.map(async (data) => setResourcePermission({
                    resourceType,
                    resourceId,
                    data: State.toAnonymousPermission(data),
                })),
                ...userRemovedItems.map(async (data) => removeResourcePermission({
                    resourceType,
                    resourceId,
                    data: State.toAnonymousPermission(data),
                })),
            ].map((task) => task.catch((error) => {
                hasError = true
                // store failure but do not abort
                console.error(error) // eslint-disable-line no-console
                if (!isMounted()) { return }
                setUserUpdateError(userId, error)
            })))

            if (!isMounted()) { return }
            if (!hasError) {
                resetUserUpdateError(userId)
            }
        }))
    }, [
        isMounted, currentUsers, permissions, resourceType, resourceId,
        resetUserUpdateError, setUserUpdateError, setDidTryClose,
    ])

    // wrap onSave with async state handling
    const [isSavingState, onSave] = useAsyncCallbackWithState(onSaveCallback)
    const { isLoading: isSaving, error } = isSavingState
    const previousIsSaving = usePrevious(isSaving)

    const isSuccessful = !!(previousIsSaving && !isSaving && !error && !hasUserError)

    /* prevent sidebar closing if unsaved changes */
    const [bindTryCloseWarning, tryCloseWarningStyle] = useSlideIn({ isVisible: didTryClose })
    const { addTransitionCheck, removeTransitionCheck } = useContext(SidebarContext)
    const shouldForceCloseRef = useRef(false)

    useEffect(() => {
        if (isSuccessful) {
            shouldForceCloseRef.current = true
            propsRef.current.loadPermissions()
            onClose()
        }
    }, [isSuccessful, onClose])

    const onCancel = useCallback(() => {
        // user clicked cancel button
        shouldForceCloseRef.current = true // use ref as we don't need to trigger render
        // no need to unset shouldForceCloseRef since cancel will lead to unmount anyway
        onClose()
    }, [onClose])

    const checkCanClose = useCallback(() => {
        // true if sidebar can close safely without cancel
        if (!hasChanges) { return true }
        if (shouldForceCloseRef.current) { return true }
        setDidTryClose(true)
        if (isSaving) { return false }
        return false
    }, [hasChanges, isSaving, setDidTryClose])

    useEffect(() => {
        addTransitionCheck(checkCanClose)
        return () => removeTransitionCheck(checkCanClose)
    }, [checkCanClose, addTransitionCheck, removeTransitionCheck])

    // hide 'save or cancel' warning message after change
    useEffect(() => {
        setDidTryClose(false)
    }, [setDidTryClose, currentUsers])

    /* render (no hooks past here) */

    if (error) { return error.message } // this shouldn't happen
    if (!permissions) { return null }

    const anonymousPermissions = currentUsers.anonymous

    // current & anonymous user not directly editable
    const editableUsers = Object.assign({}, currentUsers)
    delete editableUsers.anonymous
    delete editableUsers[currentUser]

    // users are listed in order:
    // new users in order added
    // old users in alphabetical order
    const oldUserIdList = Object.keys(editableUsers)
        .filter((userId) => !newUserIdList.includes(userId))
        .sort()

    const userEntries = [
        ...newUserIdList,
        ...oldUserIdList,
    ].map((userId) => [userId, editableUsers[userId]])

    const uid = useUniqueId('ShareSidebar')

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
        <div className={styles.root}>
            <div className={cx(styles.row, styles.cell, styles.anonAccessSelect)}>
                <label htmlFor={`${uid}AnonAccessSelect`}>{I18n.t('modal.shareResource.anonymousAccess')}</label>
                <SelectInput
                    inputId={`${uid}AnonAccessSelect`}
                    name="name"
                    options={whoHasAccessOptions}
                    value={anonymousPermissions.get ? whoHasAccessOptions[1] : whoHasAccessOptions[0]}
                    onChange={onAnonymousAccessChange}
                    required
                    isSearchable={false}
                />
            </div>
            <div className={cx(styles.row, styles.cell, styles.addUserInput)}>
                <InputNewShare onChange={addUser} canShareToUser={canShareToUser} />
            </div>
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
                            onSelect={setSelectedUserId}
                            error={userErrors[userId]}
                        />
                    </animated.div>
                ))}
            </div>
            <animated.div className={styles.errorMessageWrapper} style={tryCloseWarningStyle}>
                {/* only shows if trying to close with unsaved changes */}
                <div {...bindTryCloseWarning}>
                    <div className={styles.errorMessage}>
                        {isSaving
                            ? <Translate value="modal.shareResource.warnSavingChanges" />
                            : <Translate value="modal.shareResource.warnUnsavedChanges" />
                        }
                    </div>
                </div>
            </animated.div>
            <div className={cx(styles.footer, styles.row, styles.cell)}>
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

export function usePermissions({ resourceType, resourceId }) {
    const loadPermissionsCallback = useCallback(() => (
        getResourcePermissions({
            resourceType,
            resourceId,
        })
    ), [resourceType, resourceId])

    const [loadState, loadPermissions] = useAsyncCallbackWithState(loadPermissionsCallback)
    const { hasStarted } = loadState
    useEffect(() => {
        if (hasStarted) { return }
        loadPermissions()
    }, [hasStarted, loadPermissions])

    return [loadState, loadPermissions]
}

export default (props) => {
    const { resourceType, resourceId } = props

    const [{ isLoading, error, result: permissions }, loadPermissions] = usePermissions({
        resourceType,
        resourceId,
    })

    if (isLoading) { return 'Loading...' }
    if (error) { return error.message }
    if (!permissions) { return null }

    return (
        <ShareSidebar
            {...props}
            permissions={permissions}
            loadPermissions={loadPermissions}
        />
    )
}
