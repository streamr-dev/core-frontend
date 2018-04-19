// @flow

import { get, post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import {
    getContract, call,
    hexEqualsZero, fromWeiString,
} from '../../utils/smartContract'
import getConfig from '../../web3/config'
import { currencies, productStates } from '../../utils/constants'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product, SmartContractProduct, ProductId, Subscription } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import type { Stream } from '../../flowtype/stream-types'
import { fromNanoDollarString } from '../../utils/price'

export const getProductById = (id: ProductId): ApiResult<Product> => get(formatUrl('products', id))

export const getStreamsByProductId = (id: ProductId): ApiResult<Array<Stream>> => get(formatUrl('products', id, 'streams'))

export const postDeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'deployFree'))

export const postUndeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'undeployFree'))

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getProductFromContract = (id: ProductId): SmartContractCall<SmartContractProduct> => (
    call(contractMethods().getProduct(`0x${id}`))
)
    .then((result) => {
        if (hexEqualsZero(result.owner)) {
            throw new Error(`No product found with id ${id}`)
        }
        const state = Object.keys(productStates)[result.state]
        const currency = Object.keys(currencies)[result.currency]
        const pricePerSecond = currency === currencies.USD ? fromNanoDollarString(result.pricePerSecond) : fromWeiString(result.pricePerSecond)
        return {
            ...result,
            pricePerSecond,
            state,
            currency,
        }
    })

export const getMyProductSubscription = (id: ProductId): SmartContractCall<Subscription> => (
    getProductFromContract(id)
        .then(() => call(contractMethods().getSubscriptionTo(`0x${id}`)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
)

export const subscriptionIsValidTo = (id: ProductId): SmartContractCall<boolean> => (
    getMyProductSubscription(id)
        .then((sub: Subscription) => Date.now() < sub.endTimestamp)
)
