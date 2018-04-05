// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { getContract, call, send, asciiToHex, hexEqualsZero } from '../../utils/smartContract'
import getWeb3 from '../../web3/web3Provider'
import marketplaceConfig from '../../web3/marketplace.config'
import { currencies, productStates } from '../../utils/constants'

import type { ApiResult } from '../../flowtype/common-types'
import type { SmartContractProduct, ProductId, Subscription } from '../../flowtype/product-types'
import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'
import type { Sendable } from '../../utils/smartContract'

export const getProductById = (id: ProductId): ApiResult => get(formatUrl('products', id))

export const getStreamsByProductId = (id: ProductId): ApiResult => get(formatUrl('products', id, 'streams'))

const contractMethods = () => getContract(marketplaceConfig).methods

export const getProductFromContract = (id: ProductId): SmartContractCall<SmartContractProduct> => (
    call(contractMethods().getProduct(asciiToHex(id)))
)
    .then((result) => {
        if (hexEqualsZero(result.owner)) {
            throw new Error(`No product found with id ${id}`)
        }
        const state = Object.keys(productStates)[result.state]
        const currency = Object.keys(currencies)[result.currency]
        return {
            ...result,
            state,
            currency,
        }
    })

export const getMyProductSubscription = (id: ProductId): SmartContractCall<Subscription> => (
    getProductFromContract(id)
        .then(() => call(contractMethods().getSubscriptionTo(asciiToHex(id))))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
)

export const subscriptionIsValidTo = (id: ProductId): SmartContractCall<boolean> => (
    getMyProductSubscription(id)
        .then((sub: Subscription) => Date.now() < sub.endTimestamp)
)

export const buyProduct = (id: ProductId, subscriptionInSeconds: number): SmartContractTransaction => (
    send(contractMethods().buy(asciiToHex(id), subscriptionInSeconds))
)

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
    return send(method(web3.utils.asciiToHex(id), name, beneficiaryAddress, pricePerSecond, currencyIndex, minimumSubscriptionInSeconds))
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().createProduct, product)
)

export const updateContractProduct = (product: SmartContractProduct): SmartContractTransaction => (
    createOrUpdateContractProduct(contractMethods().updateProduct, product)
)
