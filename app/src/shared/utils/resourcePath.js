// @flow

import routes from '$routes'
import { ResourceType, type ResourceID } from './resourceUrl'

const resourcePath = (resourceType: $Keys<typeof ResourceType>, id: ResourceID) => {
    switch (resourceType) {
        case ResourceType.STREAM:
            return routes.streams.show({
                id,
            })
        case ResourceType.PRODUCT:
            return routes.products.edit({
                id,
            })
        default:
            return null
    }
}

export default resourcePath
