import { call, send, hexEqualsZero } from '$mp/utils/smartContract'
import type { SmartContractProduct, ProductId } from '$mp/types/product-types'
import type { SmartContractCall, SmartContractTransaction, Address } from '$shared/types/web3-types'
import { getValidId, mapProductFromContract, validateContractProductPricePerSecond } from '$mp/utils/product'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { marketplaceContract, getMarketplaceAbiAndAddress, getCustomTokenDecimals } from '$mp/utils/web3'
import { getContractEvents } from '$shared/utils/contractEvents'
import getCoreConfig from '$app/src/getters/getCoreConfig'

const contractMethods = (usePublicNode: boolean = false, networkChainId: number) => marketplaceContract(usePublicNode, networkChainId).methods

const parseTimestamp = (timestamp) => parseInt(timestamp, 10) * 1000

const getMarketplaceContractCreationBlock = (chainId: number): number => {
    const map = getCoreConfig().marketplaceContractCreationBlocks
    const blockItem = map.find((i) => i.chainId === chainId)

    if (blockItem == null || blockItem.blockNumber == null) {
        throw new Error('No marketplaceContractCreationBlocks defined in config for this chain!')
    }

    return blockItem.blockNumber
}

export const getProductFromContract = async (
    id: ProductId,
    usePublicNode: boolean = true,
    networkChainId: number,
): SmartContractCall<SmartContractProduct> => {
    const result = await call(contractMethods(usePublicNode, networkChainId).getProduct(getValidId(id)))

    if (!result || hexEqualsZero(result.owner)) {
        throw new Error(`No product found with id ${id}`)
    }

    const pricingTokenDecimals = await getCustomTokenDecimals(result.pricingTokenAddress, networkChainId)
    return mapProductFromContract(id, result, networkChainId, pricingTokenDecimals)
}

async function* getMarketplaceEvents(id: ProductId, eventName: string, fromBlock: number = 0, chainId: number): any {
    const web3 = getPublicWeb3(chainId)
    const abiAndAddress = getMarketplaceAbiAndAddress(chainId)
    const filter = {
        productId: getValidId(id),
    }
    yield* getContractEvents(web3, abiAndAddress.abi, abiAndAddress.address, chainId, eventName, fromBlock, filter)
}

export const getSubscribedEvents = async (id: ProductId, fromTimestamp: number, usePublicNode: boolean = true, networkChainId: number) => {
    const web3 = usePublicNode ? getPublicWeb3(networkChainId) : getWeb3()
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(fromTimestamp / 1000))
    const subscriptions = []

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const e of getMarketplaceEvents(id, 'Subscribed', fromBlock, networkChainId)) {
        for (const subEvent of e) {
            const block = await web3.eth.getBlock(subEvent.blockHash)

            if (block && block.timestamp && block.timestamp * 1000 >= fromTimestamp) {
                subscriptions.push({
                    start: block.timestamp * 1000,
                    end: subEvent.returnValues && subEvent.returnValues.endTimestamp && parseTimestamp(subEvent.returnValues.endTimestamp),
                })
            }
        }
    }

    return subscriptions
}

const createContractProductWithoutWhitelist = (product: SmartContractProduct): SmartContractTransaction => {
    const { id, name, beneficiaryAddress, pricePerSecond, minimumSubscriptionInSeconds, chainId, pricingTokenAddress } = product
    validateContractProductPricePerSecond(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).createProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        pricePerSecond,
        pricingTokenAddress,
        minimumSubscriptionInSeconds,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

const createContractProductWithWhitelist = (product: SmartContractProduct): SmartContractTransaction => {
    const { id, name, beneficiaryAddress, pricePerSecond, minimumSubscriptionInSeconds, chainId, pricingTokenAddress } = product
    validateContractProductPricePerSecond(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).createProductWithWhitelist(
        getValidId(id),
        name,
        beneficiaryAddress,
        pricePerSecond,
        pricingTokenAddress,
        minimumSubscriptionInSeconds,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => {
    if (product.requiresWhitelist) {
        return createContractProductWithWhitelist(product)
    }

    return createContractProductWithoutWhitelist(product)
}
export const updateContractProduct = (product: SmartContractProduct, redeploy: boolean = false): SmartContractTransaction => {
    const { id, name, beneficiaryAddress, pricePerSecond, minimumSubscriptionInSeconds, chainId, pricingTokenAddress } = product
    validateContractProductPricePerSecond(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).updateProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        pricePerSecond,
        pricingTokenAddress,
        minimumSubscriptionInSeconds,
        redeploy,
    )
    return send(methodToSend, {
        network: chainId,
    })
}
export const deleteProduct = (id: ProductId, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).deleteProduct(getValidId(id)), {
        network: networkChainId,
    })
export const redeployProduct = (id: ProductId, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).redeployProduct(getValidId(id)), {
        network: networkChainId,
    }) // TODO: figure out the gas for redeploying
export const setRequiresWhitelist = (id: ProductId, requiresWhitelist: boolean, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).setRequiresWhitelist(getValidId(id), requiresWhitelist), {
        network: networkChainId,
    })
export const whitelistApprove = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistApprove(getValidId(id), address), {
        network: networkChainId,
    })
export const whitelistReject = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistReject(getValidId(id), address), {
        network: networkChainId,
    })
export const whitelistRequest = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistRequest(getValidId(id), address), {
        network: networkChainId,
    })
export const getWhitelistAddresses = async (id: ProductId, networkChainId: number): Promise<Array<WhitelistItem>> => {
    try {
        const contractProduct = await getProductFromContract(id, true, networkChainId)

        if (!contractProduct || !contractProduct.requiresWhitelist) {
            return []
        }
    } catch (e) {
        // Product not deployed
        return []
    }

    const subscriptionEvents = []
    const approvedItems = []
    const rejectedItems = []
    const fromBlock = getMarketplaceContractCreationBlock(networkChainId)

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const e of getMarketplaceEvents(id, 'WhitelistApproved', fromBlock, networkChainId)) {
        for (const approveEvent of e) {
            approvedItems.push({
                address: approveEvent.returnValues.subscriber,
                blockNumber: approveEvent.blockNumber,
                approved: true,
            })
        }
    }

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const e of getMarketplaceEvents(id, 'WhitelistRejected', fromBlock, networkChainId)) {
        for (const approveEvent of e) {
            rejectedItems.push({
                address: approveEvent.returnValues.subscriber,
                blockNumber: approveEvent.blockNumber,
                approved: false,
            })
        }
    }

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const e of getMarketplaceEvents(id, 'Subscribed', fromBlock, networkChainId)) {
        for (const subEvent of e) {
            subscriptionEvents.push(subEvent)
        }
    }

    const isActiveSubscription = (address) => {
        const activeSubs = subscriptionEvents.filter(
            (e) =>
                e.returnValues &&
                e.returnValues.subscriber === address &&
                e.returnValues.endTimestamp &&
                parseTimestamp(e.returnValues.endTimestamp) > Date.now(),
        )
        return activeSubs.length > 0
    }

    const events = [...approvedItems, ...rejectedItems]
    // Sort by blockNumber to make sure we take only the latest events into account
    events.sort((a, b) => a.blockNumber - b.blockNumber)
    const addresses = new Map(events.map((item) => [item.address, item]))
    const whitelist: Array<WhitelistItem> = Array.from(addresses.values()).map((item) => ({
        address: item.address,
        status: (item.approved && (isActiveSubscription(item.address) ? 'subscribed' : 'added')) || 'removed',
        isPending: false,
    }))
    return whitelist
}
export const isAddressWhitelisted = async (id: ProductId, address: Address, usePublicNode: boolean = true, networkChainId: number) => {
    const isWhitelistStatus = await call(contractMethods(usePublicNode, networkChainId).getWhitelistState(getValidId(id), address))
    return !!(isWhitelistStatus === 2)
}
