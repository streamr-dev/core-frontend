// @flow

import BN from 'bignumber.js'
import { I18n } from 'react-redux-i18n'
import getConfig from '$shared/web3/config'
import getWeb3 from '$shared/web3/web3Provider'
import { get, put, post } from '$shared/utils/api'

import type { SmartContractTransaction, SmartContractCall, Hash } from '$shared/flowtype/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import type { NumberString, ApiResult, PaymentCurrency } from '$shared/flowtype/common-types'
import type { Product, ProductId, Subscription, ProductType } from '$mp/flowtype/product-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import { getValidId, mapProductFromApi, mapProductToPostApi, mapProductToPutApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { fromAtto, toAtto } from '$mp/utils/math'
import routes from '$routes'
import { getContract, call, send } from '../../utils/smartContract'

const marketplaceContractMethods = () => getContract(getConfig().marketplace).methods
const uniswapAdaptorContractMethods = () => getContract(getConfig().uniswapAdaptor).methods
const dataTokenContractMethods = () => getContract(getConfig().dataToken).methods
const daiTokenContractMethods = () => getContract(getConfig().daiToken).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getProductById = async (id: ProductId): ApiResult<Product> => get({
    url: routes.api.products.show({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const getStreamsByProductId = async (id: ProductId, useAuthorization: boolean = true): ApiResult<StreamList> => get({
    url: routes.api.products.streams({
        id: getValidId(id, false),
    }),
    useAuthorization,
})

export const getMyProductSubscription = (id: ProductId): SmartContractCall<Subscription> => (
    Promise.all([
        getProductFromContract(id),
        getWeb3().getDefaultAccount(),
    ])
        .then(([, account]) => call(marketplaceContractMethods().getSubscription(getValidId(id), account)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
)

export const putProduct = (data: Product, id: ProductId): ApiResult<Product> => put({
    url: routes.api.products.show({
        id,
    }),
    data: mapProductToPutApi(data),
})
    .then(mapProductFromApi)

export const postProduct = (product: Product): ApiResult<Product> => post({
    url: routes.api.products.index(),
    data: mapProductToPostApi(product),
})
    .then(mapProductFromApi)

export const postEmptyProduct = (type: ProductType): ApiResult<Product> => {
    const product = {
        type,
    }

    return post({
        url: routes.api.products.index(),
        data: product,
    })
        .then(mapProductFromApi)
}

export const postImage = (id: ProductId, image: File): ApiResult<Product> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.products.images({
            id,
        }),
        data,
        options,
    }).then(mapProductFromApi)
}

export const postUndeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: routes.api.products.undeployFree({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const postSetUndeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => post({
    url: routes.api.products.setUndeploying({
        id: getValidId(id, false),
    }),
    data: {
        transactionHash: txHash,
    },
}).then(mapProductFromApi)

export const postDeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: routes.api.products.deployFree({
        id: getValidId(id, false),
    }),
})
    .then(mapProductFromApi)

export const postSetDeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post({
        url: routes.api.products.setDeploying({
            id: getValidId(id, false),
        }),
        data: {
            transactionHash: txHash,
        },
    }).then(mapProductFromApi)
)

export const addFreeProduct = async (id: ProductId, endsAt: number): ApiResult<null> => post({
    url: routes.api.subscriptions(),
    data: {
        product: getValidId(id, false),
        endsAt,
    },
})

const ONE_DAY = '86400'

export const buyProduct = (
    id: ProductId,
    subscriptionInSeconds: NumberString | BN,
    paymentCurrency: PaymentCurrency,
    price: BN,
): SmartContractTransaction => {
    const web3 = getWeb3()
    const DAI = process.env.DAI_TOKEN_CONTRACT_ADDRESS

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            return send(uniswapAdaptorContractMethods().buyWithETH(
                getValidId(id),
                subscriptionInSeconds.toString(),
                ONE_DAY,
            ), {
                gas: gasLimits.BUY_PRODUCT_WITH_ETH,
                value: web3.utils.toWei(price.toString()).toString(),
            })
        case paymentCurrencies.DAI:
            return send(uniswapAdaptorContractMethods().buyWithERC20(
                getValidId(id),
                subscriptionInSeconds.toString(),
                ONE_DAY,
                DAI,
                web3.utils.toWei(price.toString()).toString(),
            ), {
                gas: gasLimits.BUY_PRODUCT_WITH_ERC20,
            })

        default: // Pay with DATA
            return send(marketplaceContractMethods().buy(getValidId(id), subscriptionInSeconds.toString()), {
                gas: gasLimits.BUY_PRODUCT,
            })
    }
}

export const getMyDataAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(dataTokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(fromAtto)
}

export const setMyDataAllowance = (amount: string | BN): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    const method = dataTokenContractMethods().approve(marketplaceContract().options.address, toAtto(amount).toFixed(0))
    return send(method, {
        gas: gasLimits.APPROVE,
    })
}

export const getMyDaiAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(daiTokenContractMethods().allowance(myAddress, process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS)))
        .then(fromAtto)
}

export const setMyDaiAllowance = (amount: string | BN): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    const method = daiTokenContractMethods().approve(process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS, toAtto(amount).toFixed(0))
    return send(method, {
        gas: gasLimits.APPROVE,
    })
}
