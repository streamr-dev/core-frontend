import BN from 'bignumber.js'
import getWeb3 from '$utils/web3/getWeb3'
import { get, put, post } from '$shared/utils/api'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import type { SmartContractTransaction, SmartContractCall, Hash, Address } from '$shared/types/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import {
    marketplaceContract,
    dataTokenContractMethods,
    daiTokenContractMethods,
    uniswapAdaptorContractMethods,
    getDaiAddress,
    erc20TokenContractMethods,
} from '$mp/utils/web3'
import type { NumberString, ApiResult, PaymentCurrency } from '$shared/types/common-types'
import type { Project, ProjectId, Subscription, ProjectType } from '$mp/types/project-types'
import { getValidId, mapProductFromApi, mapProductToPostApi, mapProductToPutApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { fromAtto, toAtto } from '$mp/utils/math'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { getApiStringFromChainId } from '$shared/utils/chains'
import routes from '$routes'
import { call, send } from '../../utils/smartContract'

export const getProductById = async (id: ProjectId): ApiResult<Project> =>
    get({
        url: routes.api.products.show({
            id: getValidId(id, false),
        })
    }).then(mapProductFromApi)

export const getMyProductSubscription = (id: ProjectId, chainId: number): SmartContractCall<Subscription> =>
    Promise.all([getProductFromContract(id, true, chainId), getDefaultWeb3Account()])
        .then(([, account]) => call(marketplaceContract(true, chainId).methods.getSubscription(getValidId(id), account)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))
export const putProduct = (data: Project, id: ProjectId): ApiResult<Project> =>
    put({
        url: routes.api.products.show({
            id,
        }),
        data: mapProductToPutApi(data),
    }).then(mapProductFromApi)
export const postProduct = (product: Project): ApiResult<Project> =>
    post({
        url: routes.api.products.index(),
        data: mapProductToPostApi(product),
    }).then(mapProductFromApi)
export const postEmptyProduct = (type: ProjectType, chainId?: number): ApiResult<Project> =>
    post({
        url: routes.api.products.index(),
        data: {
            type,
            chain: chainId != null ? getApiStringFromChainId(chainId) : undefined,
            pricePerSecond: '277777777777778', // default to paid product by setting price to 1 data per hour
        },
    }).then(mapProductFromApi)
export const postImage = (id: ProjectId, image: File): ApiResult<Project> => {
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
export const getPermissions = (productId: ProjectId, id: string): ApiResult<any> =>
    get({
        url: routes.api.products.permissions.show({
            productId,
            id,
        }),
    })
export const postUndeployFree = async (id: ProjectId): ApiResult<Project> =>
    post({
        url: routes.api.products.undeployFree({
            id: getValidId(id, false),
        }),
    }).then(mapProductFromApi)
export const postSetUndeploying = async (id: ProjectId, txHash: Hash): ApiResult<Project> =>
    post({
        url: routes.api.products.setUndeploying({
            id: getValidId(id, false),
        }),
        data: {
            transactionHash: txHash,
        },
    }).then(mapProductFromApi)
export const postDeployFree = async (id: ProjectId): ApiResult<Project> =>
    post({
        url: routes.api.products.deployFree({
            id: getValidId(id, false),
        }),
    }).then(mapProductFromApi)
export const postSetDeploying = async (id: ProjectId, txHash: Hash): ApiResult<Project> =>
    post({
        url: routes.api.products.setDeploying({
            id: getValidId(id, false),
        }),
        data: {
            transactionHash: txHash,
        },
    }).then(mapProductFromApi)
export const addFreeProduct = async (id: ProjectId, endsAt: number): ApiResult<null> =>
    post({
        url: routes.api.subscriptions(),
        data: {
            product: getValidId(id, false),
            endsAt,
        },
    })
const ONE_DAY = '86400'
export const buyProduct = (
    id: ProjectId,
    chainId: number,
    subscriptionInSeconds: NumberString | BN,
    paymentCurrency: PaymentCurrency,
    price: BN,
    gasIncrease = 0,
): SmartContractTransaction => {
    const web3 = getWeb3()

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            return send(uniswapAdaptorContractMethods(false, chainId).buyWithETH(getValidId(id), subscriptionInSeconds.toString(), ONE_DAY), {
                value: web3.utils.toWei(price.toString()).toString(),
                gas: gasLimits.BUY_PRODUCT_WITH_ETH + gasIncrease,
                network: chainId,
            })

        case paymentCurrencies.DAI:
            return send(
                uniswapAdaptorContractMethods(false, chainId).buyWithERC20(
                    getValidId(id),
                    subscriptionInSeconds.toString(),
                    ONE_DAY,
                    getDaiAddress(chainId),
                    web3.utils.toWei(price.toString()).toString(),
                ),
                {
                    gas: gasLimits.BUY_PRODUCT_WITH_ERC20 + gasIncrease,
                    network: chainId,
                },
            )

        default:
            // Pay with DATA or PRODUCT_DEFINED
            return send(marketplaceContract(false, chainId).methods.buy(getValidId(id), subscriptionInSeconds.toString()), {
                gas: gasLimits.BUY_PRODUCT + gasIncrease,
                network: chainId,
            })
    }
}
export const getMyDataAllowance = (chainId: number): SmartContractCall<BN> =>
    getDefaultWeb3Account()
        .then((myAddress) => call(dataTokenContractMethods(false, chainId).allowance(myAddress, marketplaceContract(false, chainId).options.address)))
        .then(fromAtto)
export const setMyDataAllowance = (amount: string | BN, chainId: number): SmartContractTransaction => {
    if (new BN(amount).isLessThan(0)) {
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
    if (new BN(amount).isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const { uniswapAdaptorContractAddress } = getCoreConfig()
    const method = daiTokenContractMethods(false, chainId).approve(uniswapAdaptorContractAddress, toAtto(amount).toFixed(0))
    return send(method, {
        network: chainId,
    })
}
export const getMyTokenAllowance = async (tokenAddress: Address, chainId: number): SmartContractCall<BN> => {
    const account = await getDefaultWeb3Account()
    const allowance = await call(
        erc20TokenContractMethods(tokenAddress, false, chainId).allowance(account, marketplaceContract(false, chainId).options.address),
    )
    return new BN(allowance)
}
export const setMyTokenAllowance = (amount: string | BN, tokenAddress: Address, chainId: number): SmartContractTransaction => {
    if (new BN(amount).isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const method = erc20TokenContractMethods(tokenAddress, false, chainId).approve(
        marketplaceContract(false, chainId).options.address,
        new BN(amount).toString(),
    )
    return send(method, {
        network: chainId,
    })
}
