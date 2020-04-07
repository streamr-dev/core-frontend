// @flow

export const ResourceType = {
    CANVAS: 'Canvas',
    DASHBOARD: 'Dashboard',
    PRODUCT: 'Product',
    STREAM: 'Stream',
}

export default class ResourceNotFoundError extends Error {
    noReport: boolean = true

    name: string = 'ResourceNotFoundError'

    resourceType: string

    resourceId: ?string

    constructor(resourceType: $Values<typeof ResourceType>, resourceId: ?string, ...args: any) {
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
