// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { getContract, call } from '../../utils/smartContract'
import getConfig from '$shared/web3/config'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product, ProductId, Subscription, UserProductPermissionList } from '$mp/flowtype/product-types'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import { getValidId, mapProductFromApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import getWeb3 from '$shared/web3/web3Provider'

export const getProductById = async (id: ProductId): ApiResult<Product> => get(formatApiUrl('products', getValidId(id, false)))
    .then(mapProductFromApi)

export const getStreamsByProductId = async (id: ProductId): ApiResult<StreamList> => (
    get(formatApiUrl('products', getValidId(id, false), 'streams'))
)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getMyProductSubscription = (id: ProductId): SmartContractCall<Subscription> => (
    Promise.all([
        getProductFromContract(id),
        getWeb3().getDefaultAccount(),
    ])
        .then(([, account]) => call(contractMethods().getSubscription(getValidId(id), account)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
)

/*
    Prefixed with 'async' so that if getValidId() throws, it can be caught with getUserProductPermissions(id).catch().
    Otherwise it'd be a synchronous error.
  */
export const getUserProductPermissions = async (id: ProductId): ApiResult<Object> => {
    const result = await get(formatApiUrl('products', getValidId(id, false), 'permissions', 'me'))

    const p = result.reduce((permissions, permission) => {
        if (permission.anonymous) {
            return {
                ...permissions,
                read: true,
            }
        }
        if (!permission.operation) {
            return permissions
        }
        return {
            ...permissions,
            [permission.operation]: true,
        }
    }, {})

    return {
        read: !!p.read || false,
        write: !!p.write || false,
        share: !!p.share || false,
    }
}
