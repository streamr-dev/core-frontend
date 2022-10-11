import { $Keys } from 'utility-types'
import routes from '$routes'
import type { ResourceID } from './resourceUrl'
import { ResourceType } from './resourceUrl'

const resourcePath = (resourceType: $Keys<typeof ResourceType>, id: ResourceID): string => {
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
