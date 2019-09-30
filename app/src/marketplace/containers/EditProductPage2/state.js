// @flow

import { productStates } from '$shared/utils/constants'
import type { Product } from '$mp/flowtype/product-types'

export function isPublished(product: Product) {
    const { state } = product || {}

    return !!(state === productStates.DEPLOYED || state === productStates.DEPLOYING)
}

export function getPendingChanges(product: Product) {
    if (isPublished(product)) {
        return product.pendingChanges || {}
    }

    return {}
}

export function hasPendingChange(product: Product, field: string) {
    const pendingChanges = getPendingChanges(product)

    return !!pendingChanges[field]
}

export function update(product: Product, fn: Function) {
    const result = fn(product)

    if (isPublished(product)) {
        return {
            ...product,
            pendingChanges: {
                ...result,
            },
        }
    }

    return {
        ...result,
    }
}

export function withPendingChanges(product: Product) {
    if (product && isPublished(product)) {
        return {
            ...product,
            ...getPendingChanges(product),
        }
    }

    return product
}
