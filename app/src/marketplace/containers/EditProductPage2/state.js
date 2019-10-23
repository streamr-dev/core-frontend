// @flow

import { productStates } from '$shared/utils/constants'
import { isCommunityProduct } from '$mp/utils/product'
import type { Product, PendingChanges } from '$mp/flowtype/product-types'

export const PENDING_CHANGE_FIELDS = [
    'name',
    'description',
    'imageUrl',
    'thumbnailUrl',
    'category',
    'streams',
    'previewStream',
    'beneficiaryAddress',
    'pricePerSecond',
    'priceCurrency',
    'adminFee',
]

export function isPublished(product: Product) {
    const { state } = product || {}

    return !!(state === productStates.DEPLOYED || state === productStates.DEPLOYING)
}

export const getPendingObject = (product: Product | PendingChanges): Object => {
    const allowedChanges = new Set(PENDING_CHANGE_FIELDS)

    return Object.fromEntries(Object.entries(product).filter(([key, value]) => allowedChanges.has(key) && value !== undefined))
}

export const getChangeObject = (original: Product, next: Product): Object => (
    Object.fromEntries(Object.entries(getPendingObject(next)).filter(([key, value]) => value !== original[key]))
)

export function getPendingChanges(product: Product): Object {
    const isPublic = isPublished(product)
    const isCommunity = isCommunityProduct(product)

    if (isPublic || isCommunity) {
        const { adminFee, ...otherPendingChanges } = getPendingObject(product.pendingChanges || {})

        if (isPublic) {
            return {
                ...otherPendingChanges,
                ...(adminFee ? {
                    adminFee,
                } : {}),
            }
        } else if (isCommunity && adminFee) {
            return {
                adminFee,
            }
        }
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
                ...getChangeObject(product, result),
            },
        }
    } else if (isCommunityProduct(product)) {
        const { adminFee, ...otherChanges } = result

        return {
            ...otherChanges,
            pendingChanges: {
                adminFee,
            },
        }
    }

    return {
        ...result,
    }
}

export function withPendingChanges(product: Product) {
    if (product && (isPublished(product) || isCommunityProduct(product))) {
        return {
            ...product,
            ...getPendingChanges(product),
        }
    }

    return product
}
