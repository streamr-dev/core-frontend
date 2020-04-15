import path from 'path'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import * as api from '$shared/utils/api'
import SelectInput from '$ui/Select'
import RadioButtonGroup from './RadioButtonGroup'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import TextInput from '$ui/Text'
import CopyLink from '$userpages/components/ShareDialog/ShareDialogContent/CopyLink'
import * as State from './state'
import styles from './ShareSidebar.pcss'

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

const getResourcePermissions = ({ resourceType, resourceId }) => api.get({
    url: `${getApiUrl(resourceType, resourceId)}/permissions`,
})

const setResourcePermission = ({ resourceType, resourceId, data }) => api.post({
    url: `${getApiUrl(resourceType, resourceId)}/permissions`,
    data,
})

const removeResourcePermission = ({ resourceType, resourceId, data }) => api.del({
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

    const currentCallback = useRef(callback)
    currentCallback.current = callback

    const isMountedRef = useRef(true)
    useEffect(() => () => {
        isMountedRef.current = false
    }, [isMountedRef])

    const run = useCallback(async () => {
        let error
        let result
        setState({
            error,
            result,
            isLoading: true,
            hasStarted: true,
        })
        try {
            result = await callback()
        } catch (err) {
            error = err
        } finally {
            // only do something if mounted and callback didn't change
            if (isMountedRef.current && currentCallback.current === callback) {
                setState({
                    error,
                    result,
                    isLoading: false,
                    hasStarted: true,
                })
            }
        }
    }, [callback])
    return [state, run]
}

function InputNewShare({ onChange }) {
    const [value, setValue] = useState('')
    const onChangeValue = useCallback((e) => {
        setValue(e.target.value)
    }, [setValue])
    const onAdd = useCallback(() => {
        onChange(value)
        setValue('')
    }, [value, onChange])

    return (
        <div className={styles.InputNewShare}>
            <TextInput
                className={styles.input}
                placeholder={I18n.t('modal.shareResource.enterEmailAddress')}
                label={I18n.t('auth.labels.address')}
                value={value}
                onChange={onChangeValue}
            />
            <Button
                kind="secondary"
                onClick={onAdd}
                disabled={!value}
                className={styles.button}
            >
                <SvgIcon name="plus" className={styles.plusIcon} />
            </Button>
        </div>
    )
}

function UserPermissions({
    resourceType,
    userId,
    userPermissions,
    updatePermission,
    removeUser,
    className,
}) {
    const detectedGroupName = State.findPermissionGroupName(resourceType, userPermissions)
    // custom handling:
    // if user edits permissions after clicking a preset, preset will be set to custom (if config doesn't match another preset)
    // when user actively clicks the custom tab, it will use whatever permissions were currently set

    const [isCustom, setIsCustom] = useState(detectedGroupName === 'custom')
    const selectedGroupName = (isCustom && detectedGroupName !== 'custom') ? 'custom' : detectedGroupName
    return (
        <div className={cx(styles.userPermissions, className)}>
            <div className={styles.permissionsHeader}>
                <h4>{userId}</h4>
                <Button
                    kind="secondary"
                    onClick={() => removeUser(userId)}
                    className={styles.button}
                >
                    <SvgIcon name="trash" className={styles.trashIcon} />
                </Button>
            </div>
            <RadioButtonGroup
                name={`UserPermissions${userId}`}
                options={Object.keys(State.getPermissionGroups(resourceType)).filter((name) => name !== 'default')}
                onChange={(name) => {
                    if (name !== 'custom') {
                        updatePermission(userId, State.getPermissionsForGroupName(resourceType, name))
                        setIsCustom(false)
                    } else {
                        setIsCustom(true)
                    }
                }}
                selectedOption={selectedGroupName}
            />
            <div className={styles.permissionsCheckboxes}>
                {Object.entries(userPermissions).map(([permission, value]) => (
                    <React.Fragment key={permission}>
                        <input
                            id={`permission${permission}`}
                            type="checkbox"
                            checked={value}
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
    )
}

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

const ShareSidebar = connect(({ user }) => ({
    currentUser: user && user.user && user.user.username,
}))((props) => {
    const {
        currentUser,
        permissions,
        resourceType,
        resourceId,
        onClose,
    } = props
    const propsRef = useRef(props)
    propsRef.current = props
    const opts = options.map((o) => ({
        label: I18n.t(`modal.shareResource.${o}`),
        value: o,
    }))

    const users = State.usersFromPermissions(resourceType, permissions)

    const [currentUsers, setCurrentUsers] = useState(users)
    const [newUserIdList, setNewUserIdList] = useState([])

    const addUser = useCallback((userId) => {
        // update state
        setCurrentUsers((prevUsers) => (
            State.addUser(prevUsers, userId, State.getPermissionsForGroupName(resourceType, 'default'))
        ))
        // add user to start of array, remove before adding to start if already in array
        setNewUserIdList((ids) => [userId, ...ids.filter((id) => id !== userId)])
    }, [setCurrentUsers, resourceType])

    const removeUser = useCallback((userId) => {
        setCurrentUsers((prevUsers) => State.removeUser(prevUsers, userId))
    }, [setCurrentUsers])

    const updatePermission = useCallback((userId, permissions) => {
        setCurrentUsers((prevUsers) => State.updatePermission(prevUsers, userId, permissions))
    }, [setCurrentUsers])

    const onAnonymousAccessChange = useCallback(({ value }) => {
        const permissions = value === 'withLink'
            ? State.getPermissionsForGroupName(resourceType, 'default')
            : State.getEmptyPermissions(resourceType)
        updatePermission('anonymous', permissions)
    }, [updatePermission, resourceType])

    const hasChanges = State.hasPermissionsChanges({
        oldPermissions: permissions,
        newUsers: currentUsers,
        resourceType,
    })

    // warn if user navigating away before saving
    useEffect(() => {
        if (!hasChanges) { return }

        window.addEventListener('beforeunload', unsavedUnloadWarning)
        return () => {
            window.removeEventListener('beforeunload', unsavedUnloadWarning)
        }
    }, [hasChanges])

    const onSaveCallback = useCallback(async () => {
        const { added, removed } = State.diffUsersPermissions({
            oldPermissions: permissions,
            newUsers: currentUsers,
            resourceType,
        })
        return Promise.all([
            ...added.map((data) => (
                setResourcePermission({
                    resourceType,
                    resourceId,
                    data,
                })
            )),
            ...removed.map((data) => {
                if (data.id == null) { return undefined }
                return removeResourcePermission({
                    resourceType,
                    resourceId,
                    data,
                })
            }),
        ]).then(() => propsRef.current.loadPermissions())
    }, [currentUsers, permissions, resourceType, resourceId, propsRef])

    const [isSavingState, onSave] = useAsyncCallbackWithState(onSaveCallback)
    const { isLoading: isSaving, error } = isSavingState

    if (error) { return error.message }
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

    return (
        <div className={styles.root}>
            <div className={cx(styles.row, styles.cell)}>
                <SelectInput
                    label={I18n.t('modal.shareResource.anonymousAccess')}
                    name="name"
                    options={opts}
                    value={anonymousPermissions.read ? opts[1] : opts[0]}
                    onChange={onAnonymousAccessChange}
                    required
                    isSearchable={false}
                />
            </div>
            <div className={cx(styles.row, styles.cell)}>
                <InputNewShare onChange={addUser} />
            </div>
            <div className={cx(styles.row, styles.userList)}>
                {userEntries.map(([userId, userPermissions]) => (
                    <UserPermissions
                        key={userId}
                        userId={userId}
                        className={styles.cell}
                        userPermissions={userPermissions}
                        resourceType={resourceType}
                        removeUser={removeUser}
                        updatePermission={updatePermission}
                        permissions={permissions}
                    />
                ))}
            </div>
            <div className={cx(styles.footer, styles.row, styles.cell)}>
                <div className={styles.copyLink}>
                    <CopyLink
                        resourceType={resourceType}
                        resourceId={resourceId}
                    />
                </div>
                <div>
                    <Button onClick={onClose}>
                        <Translate value="modal.common.cancel" />
                    </Button>
                    <Button onClick={onSave} disabled={isSaving || !hasChanges} waiting={isSaving}>
                        <Translate value="modal.shareResource.save" />
                    </Button>
                </div>
            </div>
        </div>
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
