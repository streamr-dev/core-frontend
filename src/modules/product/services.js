// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { getContract, call, send, asciiToHex, hexEqualsZero } from '../../utils/smartContract'
import getWeb3 from '../../web3/web3Provider'
import { smartContracts } from '../../web3/web3Config'
import { currencies, productStates } from '../../utils/constants'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product, SmartContractProduct, ProductId } from '../../flowtype/product-types'
import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'

const { marketplace } = smartContracts

export const getProductById = (id: ProductId): ApiResult => get(formatUrl('products', id))

export const getStreamsByProductId = (id: ProductId): ApiResult => get(formatUrl('products', id, 'streams'))

export const getProductFromContract = (id: ProductId): SmartContractCall<SmartContractProduct> => (
    call(getContract(marketplace.address, marketplace.abi).methods.getProduct(asciiToHex(id)))
        .then((result) => {
            if (hexEqualsZero(result.owner)) {
                throw new Error(`No product found with id ${ id }`)
            }
            const state = Object.keys(productStates)[result.state]
            const currency = Object.keys(currencies)[result.currency]
            return {
                ...result,
                state,
                currency,
            }
        })
)

export const buyProduct = (id: ProductId, subscriptionInSeconds: number): SmartContractTransaction => (
    send(getContract(marketplace.address, marketplace.abi)
        .methods
        .buy(asciiToHex(id), subscriptionInSeconds))
)

export const createProduct = ({
    id, name, beneficiaryAddress, pricePerSecond, priceCurrency, minimumSubscriptionInSeconds,
}: Product): SmartContractTransaction => {
    const web3 = getWeb3()
    if (!id) {
        throw new Error('No product id specified')
    }
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    if (currencyIndex < 0) {
        throw new Error(`Invalid currency: ${ priceCurrency }`)
    }
    return send(getContract(marketplace.address, marketplace.abi)
        .methods
        .createProduct(web3.utils.asciiToHex(id), name, beneficiaryAddress, pricePerSecond, currencyIndex, minimumSubscriptionInSeconds))
}
