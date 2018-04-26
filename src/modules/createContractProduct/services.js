// @flow

import { getContract, send, toWei } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import { currencies } from '../../utils/constants'

import type { SmartContractProduct } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '../../flowtype/web3-types'
import type { Sendable } from '../../utils/smartContract'
import { toNano } from '../../utils/price'
import { validateProductId, validateProductPriceCurrency, validateProductPricePerSecond } from '../../utils/product'

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
    validateProductId(id)
    validateProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = priceCurrency === 'USD' ? toNano(pricePerSecond) : toWei(pricePerSecond)
    return send(method(`0x${id}`, name, beneficiaryAddress, transformedPricePerSecond.toString(), currencyIndex, minimumSubscriptionInSeconds))
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().createProduct, product)
)

export const updateContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().updateProduct, product)
)
