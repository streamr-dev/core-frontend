import { $Keys } from 'utility-types'
import routes from '$routes'
import { ResourceID } from './resourceUrl'
import { ResourceType } from './resourceUrl'

const resourcePath = (resourceType: $Keys<typeof ResourceType>, id: ResourceID): string => {
    switch (resourceType) {
        case ResourceType.STREAM:
            return routes.streams.show({
                id,
            })

        case ResourceType.PRODUCT:
            return routes.projects.edit({
                id,
            })

        default:
            return null
    }
}

export default resourcePath
