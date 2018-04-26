// @flow

import BN from 'bignumber.js'

import type { Product, ProductId } from '../flowtype/product-types'
import { currencies } from './constants'
import { fromNano, toNano } from './price'

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

export const validateProductPricePerSecond = (pricePerSecond: number) => {
    if (pricePerSecond <= 0) {
        throw new Error('Product price must be greater than 0')
    }
}

export const mapPriceFromApi = (pricePerSecond: BN, priceCurrency: string, validate: boolean = false) => {
    if (validate) {
        validateProductPricePerSecond(pricePerSecond)
        validateProductPriceCurrency(priceCurrency)
    }
    return fromNano(pricePerSecond)
}

export const mapPriceToApi = (pricePerSecond: number, priceCurrency: string, validate: boolean = false) => {
    if (validate) {
        validateProductPricePerSecond(pricePerSecond)
        validateProductPriceCurrency(priceCurrency)
    }
    return toNano(pricePerSecond)
}

export const mapProductFromApi = (product: Product) => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond, product.priceCurrency)
    return {
        ...product,
        pricePerSecond,
    }
}

export const mapProductToApi = (product: Product) => {
    const pricePerSecond = Math.trunc(mapPriceToApi(product.pricePerSecond, product.priceCurrency))
    return {
        ...product,
        pricePerSecond,
    }
}
