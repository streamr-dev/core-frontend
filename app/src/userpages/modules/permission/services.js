// @flow

import * as api from '$shared/utils/api'
import routes from '$routes'

import type { ResourceType, ResourceId } from '../../flowtype/permission-types'

type GetApiUrl = {
    type: ResourceType,
    resourceId: ResourceId,
    id?: ResourceId,
}

export const getApiUrl = ({ type, resourceId, id }: GetApiUrl) => {
    let baseRoute
    let params
    switch (type) {
        case 'DASHBOARD':
            baseRoute = routes.api.dashboards.permissions
            params = {
                dashboardId: resourceId,
            }
            break

        case 'STREAM':
            baseRoute = routes.api.streams.permissions
            params = {
                streamId: resourceId,
            }
            break

        case 'CANVAS':
            baseRoute = routes.api.canvases.permissions
            params = {
                canvasId: resourceId,
            }
            break

        case 'PRODUCT':
            baseRoute = routes.api.products.permissions
            params = {
                productId: resourceId,
            }
            break

        default:
            break
    }

    if (!baseRoute) {
        throw new Error(`Invalid resource type: ${type}`)
    }

    if (!id) {
        return baseRoute.index({
            ...params,
        })
    }

    return baseRoute.show({
        ...params,
        id,
    })
}

export const getResourcePermissionsAPI = (type: ResourceType, resourceId: ResourceId) => (
    api.get({
        url: getApiUrl({
            type,
            resourceId,
        }),
    })
)
