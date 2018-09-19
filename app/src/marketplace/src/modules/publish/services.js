// @flow

import { post } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import { getContract, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { SmartContractTransaction, Hash } from '../../flowtype/web3-types'
import { gasLimits } from '../../utils/constants'
import { getValidId, mapProductFromApi } from '../../utils/product'

export const postDeployFree = async (id: ProductId): ApiResult<Product> => post(formatApiUrl('products', getValidId(id, false), 'deployFree'))
    .then(mapProductFromApi)

export const postUndeployFree = async (id: ProductId): ApiResult<Product> => post(formatApiUrl('products', getValidId(id, false), 'undeployFree'))
    .then(mapProductFromApi)

export const postSetDeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post(formatApiUrl('products', getValidId(id, false), 'setDeploying'), {
        transactionHash: txHash,
    }).then(mapProductFromApi)
)

export const postSetUndeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post(formatApiUrl('products', getValidId(id, false), 'setUndeploying'), {
        transactionHash: txHash,
    }).then(mapProductFromApi)
)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(getValidId(id))) // TODO: figure out the gas for redeploying
)

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(getValidId(id)), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)
