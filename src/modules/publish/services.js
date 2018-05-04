// @flow

import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { getContract, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { SmartContractTransaction, Hash } from '../../flowtype/web3-types'
import { gasLimits } from '../../utils/constants'

export const postDeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'deployFree'))

export const postUndeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'undeployFree'))

export const postSetDeploying = (id: ProductId, txHash: Hash): ApiResult<Product> =>
    post(formatUrl('products', id, 'setDeploying'), {
        transactionHash: txHash,
    })

export const postSetUndeploying = (id: ProductId, txHash: Hash): ApiResult<Product> =>
    post(formatUrl('products', id, 'setUndeploying'), {
        transactionHash: txHash,
    })

const contractMethods = () => getContract(getConfig().marketplace).methods

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(`0x${id}`)) // TODO: figure out the gas for redeploying
)

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(`0x${id}`), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)
