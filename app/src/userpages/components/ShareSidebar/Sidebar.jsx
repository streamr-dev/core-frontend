import React, { useCallback, useState, useRef, useEffect, useMemo, useContext, useReducer } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import { useSpring, useTransition, animated } from 'react-spring'

import useIsMounted from '$shared/hooks/useIsMounted'
import SelectInput from '$ui/Select'
import Errors from '$ui/Errors'
import RadioButtonGroup from './RadioButtonGroup'
import Button from '$shared/components/Button'
import { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import Checkbox from '$shared/components/Checkbox'
import SvgIcon from '$shared/components/SvgIcon'
import useUniqueId from '$shared/hooks/useUniqueId'
import TextInput from '$ui/Text'
import { isFormElement } from '$shared/utils/isEditableElement'
import {
    getResourcePermissions,
    addResourcePermission,
    removeResourcePermission,
} from '$userpages/modules/permission/services'

import * as State from './state'
import styles from './ShareSidebar.pcss'
import useMeasure from './useMeasure'
import CopyLink from './CopyLink'
import Tooltip from '$shared/components/Tooltip'

const options = ['onlyInvited', 'withLink']

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

        setState((s) => ({
            ...s,
            isLoading: true,
            hasStarted: true,
        }))

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

function InputNewShare({ currentUser, onChange, canShareToUser }) {
    const [value, setValue] = useState('')
    const onChangeValue = useCallback((e) => {
        setValue(e.target.value.trim())
    }, [setValue])
    const onAdd = useCallback(() => {
        onChange(value)
        setValue('')
    }, [value, onChange])

    const uid = useUniqueId('InputNewShare')

    function getShareToUserError({ currentUser, userId }) {
        if (!State.isValidUserId(userId)) { return I18n.t('share.error.invalidUserError') }
        if (userId === 'anonymous') { return I18n.t('share.error.anonymousUserError') }
        if (userId === currentUser) { return I18n.t('share.error.currentUserError') }
    }

    const error = getShareToUserError({
        currentUser,
        userId: value,
    })

    const isValid = canShareToUser(value)
    const [trySubmit, setTrySubmit] = useState(false)

    // only show validation when not focussed
    const [shouldShowValidation, setShouldShowValidation] = useState(false)
    const onBlur = useCallback(() => {
        setShouldShowValidation(true)
    }, [])

    const onFocus = useCallback(() => {
        setTrySubmit(false)
        setShouldShowValidation(false)
    }, [])

    const onKeyDown = useCallback((event) => {
        // try add user on enter
        if (event.key === 'Enter') {
            setTrySubmit(true)
        } else {
            setTrySubmit(false)
            setShouldShowValidation(false)
        }
    }, [])

    // only add user on enter if valid
    const shouldTrySubmit = !!(value && isValid && trySubmit)
    const onAddRef = useRef()
    onAddRef.current = onAdd
    // trigger onAdd in effect so value/validity state has chance to update
    useEffect(() => {
        if (!shouldTrySubmit) { return }
        onAddRef.current()
        setTrySubmit(false)
    }, [shouldTrySubmit, onAddRef])

    const showValidationError = shouldShowValidation && value && !isValid

    return (
        <div className={styles.InputNewShare}>
            <label htmlFor={uid}>{I18n.t('auth.labels.address')}</label>
            <TextInput
                id={uid}
                className={styles.input}
                placeholder={I18n.t('modal.shareResource.enterEmailAddress')}
                value={value}
                onChange={onChangeValue}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="email"
                invalid={showValidationError}
                onKeyDown={onKeyDown}
            />
            <Button
                kind="secondary"
                onClick={onAdd}
                disabled={!isValid}
                className={styles.button}
            >
                <SvgIcon name="plus" className={styles.plusIcon} />
            </Button>
            {showValidationError && <Errors>{error}</Errors>}
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

    // eslint-disable-next-line max-len
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
    return (
        <div
            className={cx(styles.userPermissions, className, {
                [styles.isSelected]: isSelected,
            })}
        >
            <div className={styles.permissionsHeader} onClick={onClick}>
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
                <div
                    // eslint-disable-next-line react/jsx-curly-brace-presence
                    css={`
                        align-items: center;
                        display: flex;
                    `}
                >
                    <Tooltip value="Remove">
                        <Button
                            kind="secondary"
                            onClick={(event) => {
                                event.stopPropagation()
                                removeUser(userId)
                            }}
                            className={styles.button}
                        >
                            <SvgIcon name="trash" className={styles.trashIcon} />
                        </Button>
                    </Tooltip>
                </div>
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
                            <div key={permission}>
                                <div className={styles.checkboxContainer}>
                                    <Checkbox
                                        className={styles.checkbox}
                                        id={`${userId}-${permission}`}
                                        value={value}
                                        onChange={() => updatePermission(userId, {
                                            [permission]: !value,
                                        })}
                                    />
                                </div>
                                <label htmlFor={`${userId}-${permission}`}>
                                    {startCase(I18n.t(`share.permissions.${permission}`))}
                                </label>
                            </div>
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

function filterPermissions({ permissions, currentUser }) {
    return permissions
    // remove currentUser, not editable
        .filter((p) => p.user !== currentUser)
    // convert permission.anonymous to permission.user = 'anonymous', if needed
        .map((p) => State.fromAnonymousPermission(p))
}

/*
 * big horrible async handler for updating permission records
 * each permission that was added needs to send a request that it be created
 * each permission that was removed added needs to send a request that it be removed
 * Issues all requests in parallel, should not abort if one fails.
 * Returns any errors
 */

async function savePermissions(currentUsers, props) {
    const { resourceType, resourceId, currentUser } = props
    const oldPermissions = filterPermissions({
        permissions: await getResourcePermissions({
            resourceType,
            resourceId,
        }),
        currentUser,
    })
    const { added, removed } = State.diffUsersPermissions({
        oldPermissions,
        newUsers: currentUsers,
        resourceType,
    })

    const allChangedUserIds = [
        ...new Set([
            ...added.map(({ user }) => user),
            ...removed.map(({ user }) => user),
        ]),
    ]
    const errors = {}
    await Promise.all(allChangedUserIds.map(async (userId) => {
        const userAddedItems = added.filter((p) => p.user === userId)
        const userRemovedItems = removed.filter((p) => p.id != null && p.user === userId)
        await Promise.all([
            ...userAddedItems.map(async (data) => addResourcePermission({
                resourceType,
                resourceId,
                data: State.toAnonymousPermission(data),
            })),
            ...userRemovedItems.map(async ({ id }) => removeResourcePermission({
                resourceType,
                resourceId,
                id,
            })),
        ].map((task) => task.catch((error) => {
            console.error(error) // eslint-disable-line no-console
            // store failure but do not abort
            // if user has multiple errors will only store one,
            // this is fine, we don't need to show all of them
            errors[userId] = error
        })))
    }))

    return {
        errors,
    }
}

/**
 * Handling of permission state updates, selection & new user list
 * Factored out mainly to give main component some space.
 */

function useUserPermissionState(props) {
    const { resourceType, currentUser, permissions: propPermissions } = props
    const permissions = useMemo(() => (
        filterPermissions({
            permissions: propPermissions,
            currentUser,
        })
    ), [currentUser, propPermissions])
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

    /* CRUD APIs */

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
        setCurrentUsers((prevUsers) => State.updatePermission(resourceType, prevUsers, userId, permissions))
    }, [setCurrentUsers, resourceType])

    // 'who has access' handler
    const onAnonymousAccessChange = useCallback(({ value }) => {
        const permissions = value === 'withLink'
            ? State.getPermissionsForGroupName(resourceType, 'default')
            : State.getEmptyPermissions(resourceType) // i.e. remove all permissions for anonymous
        updatePermission('anonymous', permissions)
    }, [updatePermission, resourceType])

    // return everything

    return useMemo(() => ({
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
    }), [
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
    ])
}

const ShareSidebar = connect(({ user }) => ({
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
        if (!isMounted()) { return }

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

    const [bindTryCloseWarning, tryCloseWarningStyle] = useSlideIn({ isVisible: didTryClose })

    const uid = useUniqueId('ShareSidebar') // for html labels

    /* render (no hooks past here) */

    if (error) { return error.message } // this shouldn't happen

    const whoHasAccessOptions = options.map((o) => ({
        label: I18n.t(`modal.shareResource.${o}`),
        value: o,
    }))

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
                    controlClassName={styles.anonSelectControl}
                />
            </div>
            <div className={cx(styles.row, styles.cell, styles.addUserInput)}>
                <InputNewShare currentUser={currentUser} onChange={addUser} canShareToUser={canShareToUser} />
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
            <div
                className={cx(styles.errorOverlay, {
                    [styles.errorOverlayVisible]: didTryClose,
                })}
                onClick={() => setDidTryClose(false)}
            />
            <animated.div
                className={styles.errorMessageWrapper}
                style={tryCloseWarningStyle}
            >
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

export function usePermissionsLoader({ resourceType, resourceId }) {
    const loadPermissionsCallback = useCallback(() => (
        getResourcePermissions({
            resourceType,
            resourceId,
        })
    ), [resourceType, resourceId])

    const [loadState, loadPermissions] = useAsyncCallbackWithState(loadPermissionsCallback)
    const hasProps = !!(resourceType && resourceId)
    const { hasStarted } = loadState
    useEffect(() => {
        if (hasStarted || !hasProps) { return }
        loadPermissions()
    }, [hasStarted, hasProps, loadPermissions])

    return [loadState, loadPermissions]
}

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
