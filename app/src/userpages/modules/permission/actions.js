// @flow

import path from 'path'
import settle from 'promise-settle'
import { error as errorNotification, success as successNotification } from 'react-notification-system-redux'
import * as api from '$shared/utils/api'

export const GET_RESOURCE_PERMISSIONS_REQUEST = 'GET_RESOURCE_PERMISSIONS_REQUEST'
export const GET_RESOURCE_PERMISSIONS_SUCCESS = 'GET_RESOURCE_PERMISSIONS_SUCCESS'
export const GET_RESOURCE_PERMISSIONS_FAILURE = 'GET_RESOURCE_PERMISSIONS_FAILURE'

export const ADD_RESOURCE_PERMISSION = 'ADD_RESOURCE_PERMISSION'
export const REMOVE_RESOURCE_PERMISSION = 'REMOVE_RESOURCE_PERMISSION'

export const SAVE_ADDED_RESOURCE_PERMISSION_REQUEST = 'SAVE_ADDED_RESOURCE_PERMISSIONS_REQUEST'
export const SAVE_ADDED_RESOURCE_PERMISSION_SUCCESS = 'SAVE_ADDED_RESOURCE_PERMISSIONS_SUCCESS'
export const SAVE_ADDED_RESOURCE_PERMISSION_FAILURE = 'SAVE_ADDED_RESOURCE_PERMISSIONS_FAILURE'

export const SAVE_REMOVED_RESOURCE_PERMISSION_REQUEST = 'SAVE_REMOVED_RESOURCE_PERMISSIONS_REQUEST'
export const SAVE_REMOVED_RESOURCE_PERMISSION_SUCCESS = 'SAVE_REMOVED_RESOURCE_PERMISSIONS_SUCCESS'
export const SAVE_REMOVED_RESOURCE_PERMISSION_FAILURE = 'SAVE_REMOVED_RESOURCE_PERMISSIONS_FAILURE'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Permission, ResourceType, ResourceId, Operation } from '../../flowtype/permission-types'
import type { User } from '$shared/flowtype/user-types'

const getApiUrl = (resourceType: ResourceType, resourceId: ResourceId) => {
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

export const addResourcePermission = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: ADD_RESOURCE_PERMISSION,
    resourceType,
    resourceId,
    permission,
})

export const removeResourcePermission = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: REMOVE_RESOURCE_PERMISSION,
    resourceType,
    resourceId,
    permission,
})

const getResourcePermissionsRequest = () => ({
    type: GET_RESOURCE_PERMISSIONS_REQUEST,
})

const getResourcePermissionsSuccess = (resourceType: ResourceType, resourceId: ResourceId, permissions: Array<Permission>) => ({
    type: GET_RESOURCE_PERMISSIONS_SUCCESS,
    resourceType,
    resourceId,
    permissions,
})

const getResourcePermissionsFailure = (error: ErrorInUi) => ({
    type: GET_RESOURCE_PERMISSIONS_FAILURE,
    error,
})

const saveAddedResourcePermissionRequest = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_ADDED_RESOURCE_PERMISSION_REQUEST,
    resourceType,
    resourceId,
    permission,
})

const saveAddedResourcePermissionSuccess = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_ADDED_RESOURCE_PERMISSION_SUCCESS,
    resourceType,
    resourceId,
    permission,
})

const saveAddedResourcePermissionFailure = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_ADDED_RESOURCE_PERMISSION_FAILURE,
    resourceType,
    resourceId,
    permission,
})

const saveRemovedResourcePermissionRequest = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_REMOVED_RESOURCE_PERMISSION_REQUEST,
    resourceType,
    resourceId,
    permission,
})

const saveRemovedResourcePermissionSuccess = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_REMOVED_RESOURCE_PERMISSION_SUCCESS,
    resourceType,
    resourceId,
    permission,
})

const saveRemovedResourcePermissionFailure = (resourceType: ResourceType, resourceId: ResourceId, permission: Permission) => ({
    type: SAVE_REMOVED_RESOURCE_PERMISSION_FAILURE,
    resourceType,
    resourceId,
    permission,
})

export const getResourcePermissions = (resourceType: ResourceType, resourceId: ResourceId) => (dispatch: Function) => {
    dispatch(getResourcePermissionsRequest())
    return api.get(`${getApiUrl(resourceType, resourceId)}/permissions`)
        .then((data) => dispatch(getResourcePermissionsSuccess(resourceType, resourceId, data)))
        .catch((e) => {
            dispatch(getResourcePermissionsFailure(e))
            dispatch(errorNotification({
                title: 'Error',
                message: e.message,
            }))
            throw e
        })
}

export const setResourceHighestOperationForUser = (
    resourceType: ResourceType,
    resourceId: ResourceId,
    user: $ElementType<User, 'email'>,
    operation: Operation,
) => (dispatch: Function, getState: Function) => {
    const state = getState()
    const currentPermissions = (
        state.permission.byTypeAndId[resourceType]
            ? state.permission.byTypeAndId[resourceType][resourceId]
            : []
    ).filter((p) => p.user === user)

    const operationsInOrder = ['read', 'write', 'share']
    const index = operationsInOrder.indexOf(operation)
    const addOperations = operationsInOrder.slice(0, index + 1)
    const removeOperations = operationsInOrder.slice(index + 1, operationsInOrder.length)
    addOperations.forEach((o) => {
        if (!currentPermissions.find((item) => item.operation === o)) {
            dispatch(addResourcePermission(resourceType, resourceId, {
                user,
                operation: o,
            }))
        }
    })
    removeOperations.forEach((o) => {
        const permission = currentPermissions.find((item) => item.operation === o)
        if (permission) {
            dispatch(removeResourcePermission(resourceType, resourceId, permission))
        }
    })
}

export const removeAllResourcePermissionsByUser = (
    resourceType: ResourceType,
    resourceId: ResourceId,
    user: $ElementType<User, 'email'>,
) => (dispatch: Function) => {
    ['read', 'write', 'share'].forEach((operation) => {
        dispatch(removeResourcePermission(resourceType, resourceId, {
            user,
            operation,
        }))
    })
}

export const saveUpdatedResourcePermissions = (
    resourceType: ResourceType,
    resourceId: ResourceId,
): any => (dispatch: Function, getState: Function): Promise<void> => {
    const state = getState()
    const permissions = state.permission.byTypeAndId[resourceType]
        ? state.permission.byTypeAndId[resourceType][resourceId]
        : []

    const addedPermissions = permissions.filter((p) => p.new)
    const addPermissions = new Promise((resolve) => {
        settle(addedPermissions.map((permission) => {
            dispatch(saveAddedResourcePermissionRequest(resourceType, resourceId, permission))
            return api.post(`${getApiUrl(resourceType, resourceId)}/permissions`, permission)
        }))
            .then((results) => {
                results.forEach((res, i) => {
                    if (!res.isFulfilled()) {
                        const reason = res.reason()
                        dispatch(saveAddedResourcePermissionFailure(resourceType, resourceId, {
                            ...addedPermissions[i],
                            error: reason,
                        }))
                    } else {
                        dispatch(saveAddedResourcePermissionSuccess(resourceType, resourceId, {
                            ...addedPermissions[i],
                            ...res.value(),
                        }))
                    }
                })
                resolve(results)
            })
    })

    const removedPermissions = permissions.filter((p) => p.removed)
    const removePermissions = new Promise((resolve) => {
        settle(removedPermissions.map((permission) => {
            dispatch(saveRemovedResourcePermissionRequest(resourceType, resourceId, permission))
            return api.del(`${getApiUrl(resourceType, resourceId)}/permissions/${permission.id}`, permission)
        }))
            .then((results) => {
                results.forEach((res, i) => {
                    if (!res.isFulfilled()) {
                        const reason = res.reason()
                        dispatch(saveRemovedResourcePermissionFailure(resourceType, resourceId, {
                            ...removedPermissions[i],
                            error: reason,
                        }))
                    } else {
                        dispatch(saveRemovedResourcePermissionSuccess(resourceType, resourceId, {
                            ...removedPermissions[i],
                            ...res.value(),
                        }))
                    }
                })
                resolve(results)
            })
    })

    return new Promise((resolve, reject) => {
        Promise.all([addPermissions, removePermissions])
            .then(([added, removed]) => {
                let message
                if (added.filter((p) => !p.isFulfilled()).length) {
                    message = 'Something went wrong while adding some of the permission(s)'
                } else if (removed.filter((p) => !p.isFulfilled()).length) {
                    message = 'Something went wrong while revoking some of the permission(s)'
                }
                if (message) {
                    const e = new Error(message)
                    dispatch(errorNotification({
                        title: 'Error!',
                        message,
                    }))
                    reject(e)
                } else {
                    resolve()
                    dispatch(successNotification({
                        title: 'Permissions saved successfully!',
                    }))
                }
            })
    })
}
