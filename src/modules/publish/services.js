// @flow

import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { getContract, send, asciiToHex } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '../../flowtype/web3-types'

export const postDeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'deployFree'))

export const postUndeployFree = (id: ProductId): ApiResult<Product> => post(formatUrl('products', id, 'undeployFree'))

const contractMethods = () => getContract(getConfig().marketplace).methods

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(asciiToHex(id)))
)

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(asciiToHex(id)))
)
