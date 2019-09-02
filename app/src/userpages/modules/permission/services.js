// @flow

import path from 'path'
import * as api from '$shared/utils/api'
import type { Permission, ResourceType, ResourceId } from '../../flowtype/permission-types'

export const getApiUrl = (resourceType: ResourceType, resourceId: ResourceId) => {
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

export function getResourcePermissions(resourceType: ResourceType, resourceId: ResourceId): Promise<Array<Permission>> {
    return api.get(`${getApiUrl(resourceType, resourceId)}/permissions`)
}

export function deleteResourcePermissions(resourceType: ResourceType, resourceId: ResourceId): Promise<Array<Permission>> {
    return api.del(`${getApiUrl(resourceType, resourceId)}/permissions`)
}

export function getMyResourcePermissions(resourceType: ResourceType, resourceId: ResourceId): Promise<Array<Permission>> {
    return api.get(`${getApiUrl(resourceType, resourceId)}/permissions/me`)
}
