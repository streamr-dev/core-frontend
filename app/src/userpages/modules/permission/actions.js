// @flow

import path from 'path'

import * as api from '$shared/utils/api'

export const GET_RESOURCE_PERMISSIONS_REQUEST = 'GET_RESOURCE_PERMISSIONS_REQUEST'
export const GET_RESOURCE_PERMISSIONS_SUCCESS = 'GET_RESOURCE_PERMISSIONS_SUCCESS'
export const GET_RESOURCE_PERMISSIONS_FAILURE = 'GET_RESOURCE_PERMISSIONS_FAILURE'

export const ADD_RESOURCE_PERMISSION = 'ADD_RESOURCE_PERMISSION'
export const REMOVE_RESOURCE_PERMISSION = 'REMOVE_RESOURCE_PERMISSION'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Permission, ResourceType, ResourceId } from '../../flowtype/permission-types'

const getApiUrl = (resourceType: ResourceType, resourceId: ResourceId) => {
    const urlPartsByResourceType = {
        DASHBOARD: 'dashboards',
        CANVAS: 'canvases',
        STREAM: 'streams',
        PRODUCT: 'products',
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

export const getResourcePermissionsAPI = (resourceType: ResourceType, resourceId: ResourceId) => (
    api.get({
        url: `${getApiUrl(resourceType, resourceId)}/permissions`,
    })
)

export const getResourcePermissions = (resourceType: ResourceType, resourceId: ResourceId) => async (dispatch: Function) => {
    dispatch(getResourcePermissionsRequest())
    const resourcePermissions = await getResourcePermissionsAPI(resourceType, resourceId)
        .catch((error) => {
            dispatch(getResourcePermissionsFailure(error))
            throw error
        })
    dispatch(getResourcePermissionsSuccess(resourceType, resourceId, resourcePermissions))
}
