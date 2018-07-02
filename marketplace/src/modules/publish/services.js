// @flow

import { post } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import { getContract, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { SmartContractTransaction, Hash } from '../../flowtype/web3-types'
import { gasLimits } from '../../utils/constants'
import { mapProductFromApi } from '../../utils/product'

export const postDeployFree = (id: ProductId): ApiResult<Product> => post(formatApiUrl('products', id, 'deployFree'))
    .then(mapProductFromApi)

export const postUndeployFree = (id: ProductId): ApiResult<Product> => post(formatApiUrl('products', id, 'undeployFree'))
    .then(mapProductFromApi)

export const postSetDeploying = (id: ProductId, txHash: Hash): ApiResult<Product> => post(formatApiUrl('products', id, 'setDeploying'), {
    transactionHash: txHash,
})
    .then(mapProductFromApi)

export const postSetUndeploying = (id: ProductId, txHash: Hash): ApiResult<Product> => post(formatApiUrl('products', id, 'setUndeploying'), {
    transactionHash: txHash,
})
    .then(mapProductFromApi)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(`0x${id}`)) // TODO: figure out the gas for redeploying
)

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(`0x${id}`), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)
