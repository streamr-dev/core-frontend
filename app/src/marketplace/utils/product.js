// @flow

import BN from 'bignumber.js'

import type { NumberString } from '$shared/flowtype/common-types'
import type { Product, EditProduct, ProductId, SmartContractProduct, ProductType } from '../flowtype/product-types'

import { currencies, productStates } from '$shared/utils/constants'
import { productTypes } from './constants'
import { fromAtto, fromNano, toAtto, toNano } from './math'
import { getPrefixedHexString, getUnprefixedHexString, isValidHexString } from './smartContract'

export const isPaidProduct = (product: Product) => product.isFree === false || BN(product.pricePerSecond).isGreaterThan(0)

export const isCommunityProduct = (productOrProductType?: Product | ProductType) => {
    const { type } = (typeof productOrProductType === 'string') ? {
        type: productOrProductType,
    } : (productOrProductType || {})

    return type === productTypes.COMMUNITY
}

export const validateProductPriceCurrency = (priceCurrency: string) => {
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    if (currencyIndex < 0) {
        throw new Error(`Invalid currency: ${priceCurrency}`)
    }
}

export const validateApiProductPricePerSecond = (pricePerSecond: NumberString | BN) => {
    if (BN(pricePerSecond).isLessThan(0)) {
        throw new Error('Product price must be equal to or greater than 0')
    }
}

export const validateContractProductPricePerSecond = (pricePerSecond: NumberString | BN) => {
    if (BN(pricePerSecond).isLessThanOrEqualTo(0)) {
        throw new Error('Product price must be greater than 0 to publish')
    }
}

export const mapPriceFromContract = (pricePerSecond: NumberString): string => fromAtto(pricePerSecond).toString()

export const mapProductFromContract = (id: ProductId, result: any): SmartContractProduct => {
    const minimumSubscriptionSeconds = parseInt(result.minimumSubscriptionSeconds, 10)

    return {
        id,
        name: result.name,
        ownerAddress: result.owner,
        beneficiaryAddress: result.beneficiary,
        pricePerSecond: mapPriceFromContract(result.pricePerSecond),
        priceCurrency: Object.keys(currencies)[result.currency],
        minimumSubscriptionInSeconds: Number.isNaN(minimumSubscriptionSeconds) ? 0 : minimumSubscriptionSeconds,
        state: Object.keys(productStates)[result.state],
    }
}

export const mapPriceToContract = (pricePerSecond: NumberString | BN): string => toAtto(pricePerSecond).toFixed(0)

export const mapPriceFromApi = (pricePerSecond: NumberString): string => fromNano(pricePerSecond).toString()

export const mapPriceToApi = (pricePerSecond: NumberString | BN): string => toNano(pricePerSecond).toFixed(0)

export const mapProductFromApi = (product: Product | EditProduct): Product => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return {
        ...product,
        pricePerSecond,
        pendingChanges: {
            name: 'asdasd',
            adminFee: 0.7,
        },
    }
}

export const mapAllProductsFromApi = (products: Array<Product>): Array<Product> => products.map(mapProductFromApi)

export const mapProductToApi = (product: Product | EditProduct) => {
    const pricePerSecond = mapPriceToApi(product.pricePerSecond)
    validateApiProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(product.priceCurrency)
    return {
        ...product,
        pricePerSecond,
    }
}

export const getValidId = (id: string, prefix: boolean = true): string => {
    if (!isValidHexString(id) || parseInt(id, 16) === 0) {
        throw new Error(`${id} is not valid hex string`)
    }
    return prefix ? getPrefixedHexString(id) : getUnprefixedHexString(id)
}

export const isPublishedProduct = (p: Product | EditProduct) => p.state === productStates.DEPLOYED

export const isPaidAndNotPublishedProduct = (p: Product | EditProduct) => isPaidProduct(p) && !isPublishedProduct(p)
