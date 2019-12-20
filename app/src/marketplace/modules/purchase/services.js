// @flow

import BN from 'bignumber.js'
import { getWeb3 } from '$shared/web3/web3Provider'

import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import { post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { NumberString, ApiResult, PaymentCurrency } from '$shared/flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { SmartContractTransaction } from '$shared/flowtype/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import { getValidId } from '$mp/utils/product'

export const addFreeProduct = async (id: ProductId, endsAt: number): ApiResult<null> => post({
    url: formatApiUrl('subscriptions'),
    data: {
        product: getValidId(id, false),
        endsAt,
    },
})

const marketplaceContractMethods = () => getContract(getConfig().marketplace).methods
const uniswapAdaptorContractMethods = () => getContract(getConfig().uniswapAdaptor).methods
const ONE_DAY = '86400'

export const buyProduct = (
    id: ProductId,
    subscriptionInSeconds: NumberString | BN,
    paymentCurrency: PaymentCurrency,
    ethPrice: BN,
    daiPrice: BN,
): SmartContractTransaction => {
    const web3 = getWeb3()
    const DAI = process.env.DAI_TOKEN_CONTRACT_ADDRESS

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            return send(uniswapAdaptorContractMethods().buyWithETH(getValidId(id), subscriptionInSeconds.toString(), ONE_DAY), {
                gas: gasLimits.BUY_PRODUCT_WITH_ETH,
                value: web3.utils.toWei(ethPrice.toString()).toString(),
            })
        case paymentCurrencies.DAI:
            return send(uniswapAdaptorContractMethods()
                .buyWithERC20(getValidId(id), subscriptionInSeconds.toString(), ONE_DAY, DAI, web3.utils.toWei(daiPrice.toString()).toString()), {
                gas: gasLimits.BUY_PRODUCT_WITH_ERC20,
            })

        default: // Pay with DATA
            return send(marketplaceContractMethods().buy(getValidId(id), subscriptionInSeconds.toString()), {
                gas: gasLimits.BUY_PRODUCT,
            })
    }
}
