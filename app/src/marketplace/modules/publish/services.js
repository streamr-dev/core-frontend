// @flow

import { post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ProductId, Product } from '$mp/flowtype/product-types'
import type { SmartContractTransaction, Hash } from '$shared/flowtype/web3-types'
import { getValidId, mapProductFromApi } from '$mp/utils/product'

export const postDeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: formatApiUrl('products', getValidId(id, false), 'deployFree'),
})
    .then(mapProductFromApi)

export const postSetDeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post({
        url: formatApiUrl('products', getValidId(id, false), 'setDeploying'),
        data: {
            transactionHash: txHash,
        },
    }).then(mapProductFromApi)
)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(getValidId(id))) // TODO: figure out the gas for redeploying
)
