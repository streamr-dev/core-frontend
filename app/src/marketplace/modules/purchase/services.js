// @flow

import BN from 'bignumber.js'
import { getContract, send } from '../../utils/smartContract'
import getConfig from '$shared/web3/config'
import { post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { NumberString, ApiResult } from '$shared/flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '$shared/flowtype/web3-types'
import { gasLimits } from '$shared/utils/constants'
import { getValidId } from '$mp/utils/product'

export const addFreeProduct = async (id: ProductId, endsAt: number): ApiResult<null> => post({
    url: formatApiUrl('subscriptions'),
    data: {
        product: getValidId(id, false),
        endsAt,
    },
})

const contractMethods = () => getContract(getConfig().marketplace).methods

export const buyProduct = (id: ProductId, subscriptionInSeconds: NumberString | BN): SmartContractTransaction => (
    send(contractMethods().buy(getValidId(id), subscriptionInSeconds.toString()), {
        gas: gasLimits.BUY_PRODUCT,
    })
)
