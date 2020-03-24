import path from 'path'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'

import * as api from '$shared/utils/api'
import SelectInput from '$ui/Select'
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

    const users = State.usersFromPermissions(permissions)

    const [currentUsers, setCurrentUsers] = useState(users)

    const addUser = useCallback((userId) => {
        setCurrentUsers((prevUsers) => State.addUser(prevUsers, userId))
    }, [setCurrentUsers])

    const removeUser = useCallback((userId) => {
        setCurrentUsers((prevUsers) => State.removeUser(prevUsers, userId))
    }, [setCurrentUsers])

    const updatePermission = useCallback((userId, permissions) => {
        setCurrentUsers((prevUsers) => State.updatePermission(prevUsers, userId, permissions))
    }, [setCurrentUsers])

    const onAnonymousAccessChange = useCallback(({ value }) => {
        updatePermission('anonymous', { read: value === 'withLink' })
    }, [updatePermission])

    const onSaveCallback = useCallback(async () => {
        const { added, removed } = State.diffUsersPermissions({
            oldPermissions: permissions,
            newUsers: currentUsers,
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
                <InputNewShare onChange={addUser} />
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
                                        onChange={() => updatePermission(userId, {
                                            [permission]: !value,
                                        })}
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
