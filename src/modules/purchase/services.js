// @flow

import BN from 'bignumber.js'
import { getContract, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult, NumberString } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '../../flowtype/web3-types'
import { gasLimits } from '../../utils/constants'

export const addFreeProduct = (id: ProductId, endsAt: number): ApiResult<null> => post(formatUrl('subscriptions'), {
    product: id,
    endsAt,
})

const contractMethods = () => getContract(getConfig().marketplace).methods

export const buyProduct = (id: ProductId, subscriptionInSeconds: NumberString | BN): SmartContractTransaction => (
    send(contractMethods().buy(`0x${id}`, subscriptionInSeconds.toString()), {
        gas: gasLimits.BUY_PRODUCT,
    })
)
