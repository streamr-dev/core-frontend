// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import { getContract, call } from '../../utils/smartContract'
import getConfig from '../../web3/config'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId, Subscription } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import type { Stream } from '../../flowtype/stream-types'
import { mapProductFromApi } from '../../utils/product'
import { getProductFromContract } from '../contractProduct/services'
import getWeb3 from '../../web3/web3Provider'

export const getProductById = (id: ProductId): ApiResult<Product> => get(formatApiUrl('products', id))
    .then(mapProductFromApi)

export const getStreamsByProductId = (id: ProductId): ApiResult<Array<Stream>> => get(formatApiUrl('products', id, 'streams'))

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getMyProductSubscription = (id: ProductId): SmartContractCall<Subscription> => (
    Promise.all([
        getProductFromContract(id),
        getWeb3().getDefaultAccount(),
    ])
        .then(([, account]) => call(contractMethods().getSubscription(`0x${id}`, account)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
)
