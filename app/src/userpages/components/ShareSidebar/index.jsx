import path from 'path'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'
import mapValues from 'lodash/mapValues'

import * as api from '$shared/utils/api'
import SelectInput from '$shared/components/SelectInput'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import TextInput from '$shared/components/TextInput'
import CopyLink from '$userpages/components/ShareDialog/ShareDialogContent/CopyLink'

import styles from './ShareSidebar.pcss'

const options = ['onlyInvited', 'withLink']

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

const allPermissions = [
    'read',
    'write',
    'share',
]

const emptyPermissions = allPermissions.reduce((r, p) => {
    r[p] = false
    return r
}, {})

const defaultPermissions = Object.assign({}, emptyPermissions, {
    read: true,
})

const ShareSidebar = connect(({ user }) => ({
    currentUser: user && user.user && user.user.username,
}))(({
    currentUser,
    permissions,
    resourceType,
    resourceId,
    onClose,
}) => {
    const opts = options.map((o) => ({
        label: I18n.t(`modal.shareResource.${o}`),
        value: o,
    }))

    const users = mapValues(groupBy(permissions, 'user'), (value) => {
        const r = Object.assign({}, emptyPermissions)
        value.forEach((v) => {
            r[v.operation] = true
        })
        return r
    })

    if (!users.anonymous) {
        users.anonymous = emptyPermissions
    }

    const [currentUsers, setCurrentUsers] = useState(users)

    const addNewShare = useCallback((value) => {
        setCurrentUsers((prevUsers) => ({
            ...prevUsers,
            [value]: prevUsers[value] || defaultPermissions,
        }))
    }, [setCurrentUsers])

    const removeUser = useCallback((value) => {
        setCurrentUsers((prevUsers) => {
            const next = Object.assign({}, prevUsers)
            delete next[value]
            return next
        })
    }, [setCurrentUsers])

    const updatePermission = useCallback((userId, permission, value) => {
        setCurrentUsers((prevUsers) => ({
            ...prevUsers,
            [userId]: {
                ...(prevUsers[userId] || defaultPermissions),
                [permission]: value,
            },
        }))
    }, [setCurrentUsers])

    const onAnonymousAccessChange = useCallback(({ value }) => {
        updatePermission('anonymous', 'read', value === 'withLink')
    }, [updatePermission])

    const onSaveCallback = useCallback(async () => {
        const currentUserIds = new Set(Object.keys(currentUsers))
        const prevUserIds = new Set(Object.keys(users))
        const allUsers = new Set([...currentUserIds, ...prevUserIds])
        const added = new Set([...allUsers].filter((u) => !prevUserIds.has(u)))
        const removed = new Set([...allUsers].filter((u) => !currentUserIds.has(u)))
        const maybeChanged = [...allUsers].filter((u) => !added.has(u) && !removed.has(u))
        const changed = maybeChanged.filter((u) => !isEqual(currentUsers[u], users[u]))
        return changed
    }, [])

    const [isSavingState, onSave] = useAsyncCallbackWithState(onSaveCallback)
    const { isLoading: isSaving, error } = isSavingState

    if (error) { return error.message }
    if (!permissions) { return null }

    const anonymousPermissions = currentUsers.anonymous

    const editableUsers = Object.assign({}, currentUsers)
    delete editableUsers.anonymous
    delete editableUsers[currentUser]

    return (
        <div className={styles.root}>
            <div className={styles.content}>
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
            <div className={styles.content}>
                <InputNewShare onChange={addNewShare} />
            </div>
            <div className={styles.content}>
                {Object.entries(editableUsers).map(([userId, userPermissions]) => (
                    <div key={userId} className={styles.userPermissions}>
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
                        <div className={styles.permissionsCheckboxes}>
                            {Object.entries(userPermissions).map(([permission, value]) => (
                                <React.Fragment key={permission}>
                                    <label htmlFor={`permission${permission}`}>
                                        {permission}
                                    </label>
                                    <input
                                        id={`permission${permission}`}
                                        type="checkbox"
                                        checked={value}
                                        onChange={() => updatePermission(userId, permission, !value)}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.footer}>
                <div className={styles.content}>
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
                        <Button onClick={onSave} disabled={isSaving} waiting={isSaving}>
                            <Translate value="modal.shareResource.save" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
})

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

export default (props) => {
    const { resourceType, resourceId } = props
    const loadPermissionsCallback = useCallback(() => (
        getResourcePermissions({
            resourceType,
            resourceId,
        })
    ), [resourceType, resourceId])

    const [loadState, loadPermissions] = useAsyncCallbackWithState(loadPermissionsCallback)
    const { result: permissions, isLoading, error, hasStarted } = loadState
    useEffect(() => {
        if (hasStarted) { return }
        loadPermissions()
    }, [hasStarted, loadPermissions])

    if (isLoading) { return 'Loading...' }
    if (error) { return error.message }
    if (!permissions) { return null }

    return (
        <ShareSidebar
            {...props}
            permissions={permissions}
        />
    )
}
