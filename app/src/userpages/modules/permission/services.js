// @flow

import * as api from '$shared/utils/api'
import routes from '$routes'

import type { ResourceType, ResourceId } from '../../flowtype/permission-types'

type ResourcePermission = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    id?: string | number,
}

export const getApiUrl = ({ resourceType, resourceId, id }: ResourcePermission) => {
    const mapping = {
        DASHBOARD: ['dashboards', 'dashboardId'],
        STREAM: ['streams', 'streamId'],
        CANVAS: ['canvases', 'canvasId'],
        PRODUCT: ['products', 'productId'],
    }
    const [urlPart, targetId]: [string, string] = mapping[resourceType] || []

    if (!routes.api[urlPart] || !routes.api[urlPart].permissions) {
        throw new Error(`Invalid resource type: ${resourceType}`)
    }

    const permissionRoute = routes.api[urlPart].permissions

    if (!id) {
        return permissionRoute.index({
            [targetId]: resourceId,
        })
    }

    return permissionRoute.show({
        [targetId]: resourceId,
        id,
    })
}

export const getResourcePermissions = async ({ resourceType, resourceId, id }: ResourcePermission) => (
    api.get({
        url: getApiUrl({
            resourceType,
            resourceId,
            id,
        }),
    })
)

type AddResourcePermission = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    data: Object,
}

export const addResourcePermission = async ({ resourceType, resourceId, data }: AddResourcePermission) => (
    api.post({
        url: getApiUrl({
            resourceType,
            resourceId,
        }),
        data,
    })
)

export const removeResourcePermission = async ({ resourceType, resourceId, id }: ResourcePermission) => (
    api.del({
        url: getApiUrl({
            resourceType,
            resourceId,
            id,
        }),
    })
)
