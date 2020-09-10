// @flow

import type { Permission, ResourceType, ResourceId } from '../permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import {
    GET_RESOURCE_PERMISSIONS_REQUEST,
    GET_RESOURCE_PERMISSIONS_SUCCESS,
    GET_RESOURCE_PERMISSIONS_FAILURE,
    RESET_RESOURCE_PERMISSIONS,
} from '../../modules/permission/actions'

export type PermissionAction = {
    type: typeof GET_RESOURCE_PERMISSIONS_REQUEST
} | {
    type: typeof GET_RESOURCE_PERMISSIONS_SUCCESS,
    resourceType: ResourceType,
    resourceId: ResourceId,
    permissions: Array<Permission>
} | {
    type: typeof GET_RESOURCE_PERMISSIONS_FAILURE,
    error: ErrorInUi,
    resourceType: ResourceType,
    resourceId: ResourceId
} | {
    type: typeof RESET_RESOURCE_PERMISSIONS,
    resourceType: ResourceType,
    resourceId: ResourceId
}
