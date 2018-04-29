// @flow

import BN from 'bignumber.js'

import type { NumberString } from '../flowtype/common-types'
import type { Product, ProductId, SmartContractProduct } from '../flowtype/product-types'
import { currencies, productStates } from './constants'
import { fromAtto, fromNano, toAtto, toNano } from './math'
import { hexEqualsZero } from './smartContract'

export const isPaidProduct = (product: Product) => BN(product.pricePerSecond).isGreaterThan(0)

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
    if (hexEqualsZero(result.owner)) {
        throw new Error(`No product found with id ${id}`)
    }

    return {
        id,
        name: result.name,
        ownerAddress: result.owner,
        beneficiaryAddress: result.beneficiary,
        pricePerSecond: mapPriceFromContract(result.pricePerSecond),
        priceCurrency: Object.keys(currencies)[result.currency],
        minimumSubscriptionInSeconds: parseInt(result.minimumSubscriptionSeconds, 10),
        state: Object.keys(productStates)[result.state],
    }
}

export const mapPriceToContract = (pricePerSecond: NumberString | BN): string => toAtto(pricePerSecond).toFixed()

export const mapPriceFromApi = (pricePerSecond: NumberString): BN => fromNano(pricePerSecond)

export const mapPriceToApi = (pricePerSecond: NumberString | BN): string => toNano(pricePerSecond).toFixed()

export const mapProductFromApi = (product: Product) => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return {
        ...product,
        pricePerSecond,
    }
}

export const mapProductToApi = (product: Product) => {
    const pricePerSecond = mapPriceToApi(product.pricePerSecond)
    validateApiProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(product.priceCurrency)
    return {
        ...product,
        pricePerSecond,
    }
}
