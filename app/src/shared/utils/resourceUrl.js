// @flow

import routes from '$routes'

export const ResourceType = {
    STREAM: 'STREAM',
    PRODUCT: 'PRODUCT',
}

export type ResourceID = string | number | null | void

const resourceUrl = (resourceType: $Keys<typeof ResourceType>, id: ResourceID) => {
    switch (resourceType) {
        case ResourceType.STREAM:
            return routes.streams.public.stream({
                id,
            })
        default:
            throw new Error(`Invalid resource type "${resourceType}"`)
    }
}

export default resourceUrl
