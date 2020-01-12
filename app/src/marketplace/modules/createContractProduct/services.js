// @flow

import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import { contractCurrencies as currencies, gasLimits } from '$shared/utils/constants'

import type { SmartContractProduct } from '$mp/flowtype/product-types'
import type { SmartContractTransaction } from '$shared/flowtype/web3-types'
import type { Sendable } from '$mp/utils/smartContract'
import {
    mapPriceToContract, validateProductPriceCurrency,
    validateContractProductPricePerSecond, getValidId,
} from '$mp/utils/product'

const contractMethods = () => getContract(getConfig().marketplace).methods

const createOrUpdateContractProduct = (method: (...any) => Sendable, product: SmartContractProduct): SmartContractTransaction => {
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
    const methodToSend =
        method(getValidId(id), name, beneficiaryAddress, transformedPricePerSecond, currencyIndex, minimumSubscriptionInSeconds)
    return send(methodToSend, {
        gas: gasLimits.CREATE_PRODUCT,
    })
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().createProduct, product)
)

export const updateContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().updateProduct, product)
)
