import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { isDataUnionProduct } from '$mp/utils/product'
import { projectStates } from '$shared/utils/constants'
import type { Project, PendingChanges } from '$mp/types/project-types'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
export const PENDING_CHANGE_FIELDS: RecursiveKeyOf<Project>[] = [
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
export function isPublished(product: Project): boolean {
    const { state } = product || {}
    return !!(state === projectStates.DEPLOYED || state === projectStates.DEPLOYING)
}
export const getPendingObject = (product: Project | PendingChanges): Partial<Project | PendingChanges> => {
    let pendingObj = pick(product, PENDING_CHANGE_FIELDS)
    pendingObj = pickBy(pendingObj, (value) => value !== undefined)
    return pendingObj
}
export const getChangeObject = (original: Project, next: Project): Record<string, any> =>
    Object.fromEntries(Object.entries(getPendingObject(next)).filter(([key, value]) => !isEqual(value, original[key as keyof Project])))

// Returns smart contract field changes and other changes separated
const getChanges = (product: Partial<Project>) => {
    const { adminFee, requiresWhitelist, pricingTokenAddress, ...otherChanges } = product
    // $FlowFixMe: Computing object literal [1] may lead to an exponentially large number of cases
    const smartContractFields = {
        ...(adminFee
            ? {
                adminFee,
            }
            : {}),
        ...(requiresWhitelist
            ? {
                requiresWhitelist,
            }
            : {}),
        ...(pricingTokenAddress
            ? {
                pricingTokenAddress,
            }
            : {}),
    }
    return [smartContractFields, otherChanges]
}

export function getPendingChanges(product: Project): Record<string, any> {
    const isProductPublished = isPublished(product)
    const [smartContractFields, otherChanges] = getChanges(getPendingObject(product.pendingChanges || {}))

    if (isProductPublished) {
        return { ...otherChanges, ...smartContractFields }
    }

    return { ...smartContractFields }
}
export function hasPendingChange(product: Project, field: string) {
    const pendingChanges = getPendingChanges(product)
    return get(pendingChanges, field) !== undefined
}
export function update(product: Project, fn: (...args: Array<any>) => any) {
    const result = fn(product)
    const [smartContractFields, otherChanges] = getChanges(result)
    const isProductPublished = isPublished(product)

    if (isProductPublished) {
        return { ...product, pendingChanges: { ...getChangeObject(product, result) } }
    }

    return { ...otherChanges, pendingChanges: { ...smartContractFields } }
}
export function withPendingChanges(product: Project) {
    if (product && (isPublished(product) || isDataUnionProduct(product))) {
        return { ...product, ...getPendingChanges(product) }
    }

    return product
}
