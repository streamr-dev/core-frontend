// @flow

import { getContract, send, toWeiString } from '../../utils/smartContract'
import getWeb3 from '../../web3/web3Provider'
import getConfig from '../../web3/config'
import { currencies } from '../../utils/constants'

import type { SmartContractProduct } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '../../flowtype/web3-types'
import type { Sendable } from '../../utils/smartContract'
import { toNanoDollarString } from '../../utils/price'

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
    const web3 = getWeb3()
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    if (!id) {
        throw new Error('No product id specified')
    }
    if (currencyIndex < 0) {
        throw new Error(`Invalid currency: ${priceCurrency}`)
    }
    if (pricePerSecond <= 0) {
        throw new Error('Product price must be greater than 0')
    }
    const transformedPricePerSecond = priceCurrency === 'USD' ? toNanoDollarString(pricePerSecond) : toWeiString(pricePerSecond)
    return send(method(web3.utils.asciiToHex(id), name, beneficiaryAddress, transformedPricePerSecond, currencyIndex, minimumSubscriptionInSeconds))
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().createProduct, product)
)

export const updateContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().updateProduct, product)
)
