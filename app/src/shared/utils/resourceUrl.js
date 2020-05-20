// @flow

import routes from '$routes'

export const ResourceType = {
    CANVAS: 'CANVAS',
    DASHBOARD: 'DASHBOARD',
    STREAM: 'STREAM',
}

export type ResourceID = string | number | null | void

export default (resourceType: $Keys<typeof ResourceType>, id: ResourceID) => {
    switch (resourceType) {
        case ResourceType.CANVAS:
            return routes.canvases.public.edit({
                id,
            })
        case ResourceType.DASHBOARD:
            return routes.dashboards.public.edit({
                id,
            })
        case ResourceType.STREAM:
            return routes.streams.public.show({
                id,
            })
        default:
            throw new Error(`Invalid resource type "${resourceType}"`)
    }
}
