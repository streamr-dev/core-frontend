// @flow

export const GET_RESOURCE_PERMISSIONS_REQUEST = 'GET_RESOURCE_PERMISSIONS_REQUEST'
export const GET_RESOURCE_PERMISSIONS_SUCCESS = 'GET_RESOURCE_PERMISSIONS_SUCCESS'
export const GET_RESOURCE_PERMISSIONS_FAILURE = 'GET_RESOURCE_PERMISSIONS_FAILURE'

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

const getResourcePermissionsFailure = (error: ErrorInUi) => ({
    type: GET_RESOURCE_PERMISSIONS_FAILURE,
    error,
})

export const getResourcePermissions = (resourceType: ResourceType, resourceId: ResourceId) => async (dispatch: Function) => {
    dispatch(getResourcePermissionsRequest())
    const resourcePermissions = await services.getResourcePermissions({
        resourceType,
        resourceId,
    })
        .catch((error) => {
            dispatch(getResourcePermissionsFailure(error))
            throw error
        })
    dispatch(getResourcePermissionsSuccess(resourceType, resourceId, resourcePermissions))
}
