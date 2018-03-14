// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import { marketplaceContract } from '../../web3/smartContracts'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type {Address, SmartContractConstantCall, SmartContractTransactionCall} from '../../flowtype/web3-types'

export const getProductById = (id: ProductId): ApiResult => get(formatUrl('products', id))

export const getStreamsByProductId = (id: ProductId): ApiResult => get(formatUrl('products', id, 'streams'))

export const getPriceFromContract = (id: ProductId): SmartContractConstantCall => marketplaceContract.getProduct(id)

export const buyProduct = (id: ProductId, timeInSeconds: number): SmartContractTransactionCall => marketplaceContract.buy(id, timeInSeconds)
