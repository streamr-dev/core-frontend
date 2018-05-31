// @flow

import BN from 'bignumber.js'

import type { NumberString } from '../flowtype/common-types'
import type { Product, EditProduct, ProductId, SmartContractProduct } from '../flowtype/product-types'

import { currencies, productStates } from './constants'
import { fromAtto, fromNano, toAtto, toNano } from './math'

export const isPaidProduct = (product: Product) => product.isFree === false || BN(product.pricePerSecond).isGreaterThan(0)

export const validateProductId = (id: ?ProductId, enforceHexPrefix: boolean = false) => {
    if (!id) {
        throw new Error('No id specified')
    }
    if (!new RegExp(`(0x)${!enforceHexPrefix ? '?' : ''}[0-9a-fA-F]+`).test(id)) {
        throw new Error('Id is not a valid hex string')
    }
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

export const mapProductFromApi = (product: Product | EditProduct) => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return {
        ...product,
        pricePerSecond,
    }
}

export const mapProductToApi = (product: Product | EditProduct) => {
    const pricePerSecond = mapPriceToApi(product.pricePerSecond)
    validateApiProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(product.priceCurrency)
    return {
        ...product,
        pricePerSecond,
    }
}

export const isPaidAndNotPublishedProduct = (p: Product | EditProduct) => p.isFree === false && p.state !== productStates.DEPLOYED
