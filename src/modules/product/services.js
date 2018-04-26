// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { getContract, call } from '../../utils/smartContract'
import getConfig from '../../web3/config'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId, Subscription } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import type { Stream } from '../../flowtype/stream-types'
import { mapProductFromApi } from '../../utils/product'
import { getProductFromContract } from '../contractProduct/services'

export const getProductById = (id: ProductId): ApiResult<Product> => get(formatUrl('products', id))
    .then(mapProductFromApi)

export const getStreamsByProductId = (id: ProductId): ApiResult<Array<Stream>> => get(formatUrl('products', id, 'streams'))

const contractMethods = () => getContract(getConfig().marketplace).methods

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
