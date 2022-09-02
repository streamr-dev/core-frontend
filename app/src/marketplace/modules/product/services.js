// @flow

import BN from 'bignumber.js'
import getWeb3 from '$utils/web3/getWeb3'
import { get, put, post } from '$shared/utils/api'

import getCoreConfig from '$app/src/getters/getCoreConfig'
import type { SmartContractTransaction, SmartContractCall, Hash, Address } from '$shared/flowtype/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import {
    marketplaceContract,
    dataTokenContractMethods,
    daiTokenContractMethods,
    uniswapAdaptorContractMethods,
    getDaiAddress,
    erc20TokenContractMethods,
} from '$mp/utils/web3'
import type { NumberString, ApiResult, PaymentCurrency } from '$shared/flowtype/common-types'
import type { Product, ProductId, Subscription, ProductType } from '$mp/flowtype/product-types'
import { getValidId, mapProductFromApi, mapProductToPostApi, mapProductToPutApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { fromAtto, toAtto } from '$mp/utils/math'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'
import { call, send } from '../../utils/smartContract'

export const getProductById = async (id: ProductId, useAuthorization: boolean = true): ApiResult<Product> => get({
    url: routes.api.products.show({
        id: getValidId(id, false),
    }),
    useAuthorization,
})
    .then(mapProductFromApi)

export const getMyProductSubscription = (id: ProductId, chainId: number): SmartContractCall<Subscription> => (
    Promise.all([
        getProductFromContract(id, true, chainId),
        getDefaultWeb3Account(),
    ])
        .then(([, account]) => call(marketplaceContract(false, chainId).methods.getSubscription(getValidId(id), account)))
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

export const postEmptyProduct = (type: ProductType): ApiResult<Product> => post({
    url: routes.api.products.index(),
    data: {
        type,
    },
})
    .then(mapProductFromApi)

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

export const getPermissions = (productId: ProductId, id: string): ApiResult<any> => (
    get({
        url: routes.api.products.permissions.show({
            productId,
            id,
        }),
    })
)

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
    chainId: number,
    subscriptionInSeconds: NumberString | BN,
    paymentCurrency: PaymentCurrency,
    price: BN,
    gasIncrease?: number = 0,
): SmartContractTransaction => {
    const web3 = getWeb3()

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            return send(uniswapAdaptorContractMethods(false, chainId).buyWithETH(
                getValidId(id),
                subscriptionInSeconds.toString(),
                ONE_DAY,
            ), {
                value: web3.utils.toWei(price.toString()).toString(),
                gas: gasLimits.BUY_PRODUCT_WITH_ETH + gasIncrease,
                network: chainId,
            })
        case paymentCurrencies.DAI:
            return send(uniswapAdaptorContractMethods(false, chainId).buyWithERC20(
                getValidId(id),
                subscriptionInSeconds.toString(),
                ONE_DAY,
                getDaiAddress(chainId),
                web3.utils.toWei(price.toString()).toString(),
            ), {
                gas: gasLimits.BUY_PRODUCT_WITH_ERC20 + gasIncrease,
                network: chainId,
            })

        default: // Pay with DATA
            return send(marketplaceContract(false, chainId).methods.buy(getValidId(id), subscriptionInSeconds.toString()), {
                gas: gasLimits.BUY_PRODUCT + gasIncrease,
                network: chainId,
            })
    }
}

export const getMyDataAllowance = (chainId: number): SmartContractCall<BN> => (
    getDefaultWeb3Account()
        .then((myAddress) => call(dataTokenContractMethods(false, chainId).allowance(myAddress, marketplaceContract(false, chainId).options.address)))
        .then(fromAtto)
)

export const setMyDataAllowance = (amount: string | BN, chainId: number): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const method = dataTokenContractMethods(false, chainId).approve(marketplaceContract(false, chainId).options.address, toAtto(amount).toFixed(0))
    return send(method, {
        network: chainId,
    })
}

export const getMyDaiAllowance = (chainId: number): SmartContractCall<BN> => {
    const { uniswapAdaptorContractAddress } = getCoreConfig()
    return getDefaultWeb3Account()
        .then((myAddress) => call(daiTokenContractMethods(false, chainId).allowance(myAddress, uniswapAdaptorContractAddress)))
        .then(fromAtto)
}

export const setMyDaiAllowance = (amount: string | BN, chainId: number): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const { uniswapAdaptorContractAddress } = getCoreConfig()
    const method = daiTokenContractMethods(false, chainId).approve(uniswapAdaptorContractAddress, toAtto(amount).toFixed(0))
    return send(method, {
        network: chainId,
    })
}

export const getMyTokenAllowance = (tokenAddress: Address, chainId: number): SmartContractCall<BN> => (
    getDefaultWeb3Account()
        .then((myAddress) =>
            call(erc20TokenContractMethods(tokenAddress, false, chainId).allowance(myAddress, marketplaceContract(false, chainId).options.address)))
        .then(fromAtto)
)

export const setMyTokenAllowance = (amount: string | BN, tokenAddress: Address, chainId: number): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const method = erc20TokenContractMethods(tokenAddress, false, chainId)
        .approve(marketplaceContract(false, chainId).options.address, toAtto(amount).toFixed(0))

    return send(method, {
        network: chainId,
    })
}
