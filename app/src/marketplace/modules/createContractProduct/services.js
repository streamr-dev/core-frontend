// @flow

import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import { contractCurrencies as currencies, gasLimits } from '$shared/utils/constants'

import type { SmartContractProduct } from '$mp/flowtype/product-types'
import type { SmartContractTransaction } from '$shared/flowtype/web3-types'
import {
    mapPriceToContract, validateProductPriceCurrency,
    validateContractProductPricePerSecond, getValidId,
} from '$mp/utils/product'

const contractMethods = () => getContract(getConfig().marketplace).methods

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods().createProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
    )
    return send(methodToSend, {
        gas: gasLimits.CREATE_PRODUCT,
    })
}

export const updateContractProduct = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods().updateProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
        false,
    )
    return send(methodToSend, {
        gas: gasLimits.UPDATE_PRODUCT,
    })
}
