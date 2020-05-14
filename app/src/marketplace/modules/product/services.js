// @flow

import { get, put, post } from '$shared/utils/api'
import { getContract, call } from '../../utils/smartContract'
import getConfig from '$shared/web3/config'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product, ProductId, Subscription, ProductType } from '$mp/flowtype/product-types'
import type { SmartContractCall, Hash } from '$shared/flowtype/web3-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import { getValidId, mapProductFromApi, mapProductToPostApi, mapProductToPutApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import getWeb3 from '$shared/web3/web3Provider'
import routes from '$routes'

export const getProductById = async (id: ProductId): ApiResult<Product> => get({
    url: routes.api.products.show({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const getStreamsByProductId = async (id: ProductId, useAuthorization: boolean = true): ApiResult<StreamList> => get({
    url: routes.api.products.streams({
        id: getValidId(id, false),
    }),
    useAuthorization,
})

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
    const result = await get({
        url: routes.api.products.permissions({
            id: getValidId(id, false),
        }),
    })

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

export const putProduct = (data: Product, id: ProductId): ApiResult<Product> => put({
    url: routes.api.products.show({
        id,
    }),
    data: mapProductToPutApi(data),
})
    .then(mapProductFromApi)

export const postProduct = (product: Product): ApiResult<Product> => post({
    url: routes.api.products.index(),
    data: mapProductToPostApi(product),
})
    .then(mapProductFromApi)

export const postEmptyProduct = (type: ProductType): ApiResult<Product> => {
    const product = {
        type,
    }

    return post({
        url: routes.api.products.index(),
        data: product,
    })
        .then(mapProductFromApi)
}

export const postImage = (id: ProductId, image: File): ApiResult<Product> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.products.images({
            id,
        }),
        data,
        options,
    }).then(mapProductFromApi)
}

export const postUndeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: routes.api.products.undeployFree({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const postSetUndeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => post({
    url: routes.api.products.setUndeploying({
        id: getValidId(id, false),
    }),
    data: {
        transactionHash: txHash,
    },
}).then(mapProductFromApi)

export const postDeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: routes.api.products.deployFree({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const postSetDeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post({
        url: routes.api.products.setDeploying({
            id: getValidId(id, false),
        }),
        data: {
            transactionHash: txHash,
        },
    }).then(mapProductFromApi)
)
