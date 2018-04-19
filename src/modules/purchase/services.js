// @flow

import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '../../flowtype/web3-types'

import { getContract, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'

export const addFreeProduct = (id: ProductId, endsAt: number): ApiResult<null> => post(formatUrl('subscriptions'), {
    product: id,
    endsAt,
})

const contractMethods = () => getContract(getConfig().marketplace).methods

export const buyProduct = (id: ProductId, subscriptionInSeconds: number): SmartContractTransaction => (
    send(contractMethods().buy(`0x${id}`, subscriptionInSeconds))
)
