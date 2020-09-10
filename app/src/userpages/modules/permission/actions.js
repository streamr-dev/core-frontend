// @flow

export const GET_RESOURCE_PERMISSIONS_REQUEST = 'GET_RESOURCE_PERMISSIONS_REQUEST'
export const GET_RESOURCE_PERMISSIONS_SUCCESS = 'GET_RESOURCE_PERMISSIONS_SUCCESS'
export const GET_RESOURCE_PERMISSIONS_FAILURE = 'GET_RESOURCE_PERMISSIONS_FAILURE'
export const RESET_RESOURCE_PERMISSIONS = 'RESET_RESOURCE_PERMISSIONS'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Permission, ResourceType, ResourceId } from '../../flowtype/permission-types'

import * as services from './services'

const getResourcePermissionsRequest = () => ({
    type: GET_RESOURCE_PERMISSIONS_REQUEST,
})

const getResourcePermissionsSuccess = (resourceType: ResourceType, resourceId: ResourceId, permissions: Array<Permission>) => ({
    type: GET_RESOURCE_PERMISSIONS_SUCCESS,
    resourceType,
    resourceId,
    permissions,
})

const getResourcePermissionsFailure = (error: ErrorInUi, resourceType: ResourceType, resourceId: ResourceId) => ({
    type: GET_RESOURCE_PERMISSIONS_FAILURE,
    error,
    resourceType,
    resourceId,
})

export const getResourcePermissions = (resourceType: ResourceType, resourceId: ResourceId) => async (dispatch: Function) => {
    dispatch(getResourcePermissionsRequest())

    try {
        const resourcePermissions = await services.getResourcePermissions({
            resourceType,
            resourceId,
            id: 'me',
        })
        dispatch(getResourcePermissionsSuccess(resourceType, resourceId, resourcePermissions))
    } catch (error) {
        dispatch(getResourcePermissionsFailure(error, resourceType, resourceId))
        console.warn(error)
        throw error
    }
}

export const resetResourcePermission = (resourceType: ResourceType, resourceId: ResourceId) => ({
    type: RESET_RESOURCE_PERMISSIONS,
    resourceType,
    resourceId,
})
