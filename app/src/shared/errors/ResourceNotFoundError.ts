import { $Values } from 'utility-types'
export const ResourceType = {
    PRODUCT: 'Product',
    STREAM: 'Stream',
}
export default class ResourceNotFoundError extends Error {
    noReport = true
    name = 'ResourceNotFoundError'
    resourceType: string
    resourceId: string | null | undefined

    constructor(resourceType: $Values<typeof ResourceType>, resourceId: string | null | undefined, ...args: any) {
        if (resourceId) {
            super(`${resourceType}#${resourceId} could not be found`, ...args)
        } else {
            super(`${resourceType} without an ID could not be found`, ...args)
        }

        this.resourceType = resourceType
        this.resourceId = resourceId

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ResourceNotFoundError)
        }

        Object.setPrototypeOf(this, ResourceNotFoundError.prototype)
    }
}
