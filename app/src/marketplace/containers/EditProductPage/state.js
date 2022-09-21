// @flow

import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { isDataUnionProduct } from '$mp/utils/product'
import { productStates } from '$shared/utils/constants'
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
    'timeUnit',
    'price',
    'termsOfUse',
    'contact.url',
    'contact.email',
    'contact.social1',
    'contact.social2',
    'contact.social3',
    'contact.social4',
    'requiresWhitelist',
    'pricingTokenAddress',
]

export function isPublished(product: Product) {
    const { state } = product || {}

    return !!(state === productStates.DEPLOYED || state === productStates.DEPLOYING)
}

export const getPendingObject = (product: Product | PendingChanges): Object => {
    let pendingObj = pick(product, PENDING_CHANGE_FIELDS)
    pendingObj = pickBy(pendingObj, (value) => value !== undefined)
    return pendingObj
}

export const getChangeObject = (original: Product, next: Product): Object => (
    Object.fromEntries(Object.entries(getPendingObject(next)).filter(([key, value]) => !isEqual(value, original[key])))
)

// Returns smart contract field changes and other changes separated
const getChanges = (product: Product) => {
    const { adminFee, requiresWhitelist, pricingTokenAddress, ...otherChanges } = product

    // $FlowFixMe: Computing object literal [1] may lead to an exponentially large number of cases
    const smartContractFields = {
        ...(adminFee ? {
            adminFee,
        } : {}),
        ...(requiresWhitelist ? {
            requiresWhitelist,
        } : {}),
        ...(pricingTokenAddress ? {
            pricingTokenAddress,
        } : {}),
    }
    return [smartContractFields, otherChanges]
}

export function getPendingChanges(product: Product): Object {
    const isProductPublished = isPublished(product)
    const [smartContractFields, otherChanges] = getChanges(getPendingObject(product.pendingChanges || {}))

    if (isProductPublished) {
        return {
            ...otherChanges,
            ...smartContractFields,
        }
    }

    return {
        ...smartContractFields,
    }
}

export function hasPendingChange(product: Product, field: string) {
    const pendingChanges = getPendingChanges(product)

    return get(pendingChanges, field) !== undefined
}

export function update(product: Product, fn: Function) {
    const result = fn(product)
    const [smartContractFields, otherChanges] = getChanges(result)
    const isProductPublished = isPublished(product)

    if (isProductPublished) {
        return {
            ...product,
            pendingChanges: {
                ...getChangeObject(product, result),
            },
        }
    }

    return {
        ...otherChanges,
        pendingChanges: {
            ...smartContractFields,
        },
    }
}

export function withPendingChanges(product: Product) {
    if (product && (isPublished(product) || isDataUnionProduct(product))) {
        return {
            ...product,
            ...getPendingChanges(product),
        }
    }

    return product
}
