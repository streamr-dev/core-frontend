// @flow

import { getContract, call, send, hexEqualsZero } from '$mp/utils/smartContract'
import getConfig, { getConfigForChain } from '$shared/web3/config'
import type { SmartContractProduct, ProductId } from '$mp/flowtype/product-types'
import type { SmartContractCall, SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import {
    getValidId,
    mapProductFromContract,
    mapPriceToContract,
    validateProductPriceCurrency,
    validateContractProductPricePerSecond,
} from '$mp/utils/product'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { contractCurrencies as currencies } from '$shared/utils/constants'

const getMarketplaceAbiAndAddressForNetwork = (networkChainId: number) => {
    const { marketplace } = getConfigForChain(networkChainId)
    return marketplace
}

const contractMethods = (usePublicNode: boolean = false, networkChainId: number) => {
    const abiAndAddress = getMarketplaceAbiAndAddressForNetwork(networkChainId)
    return getContract(abiAndAddress, usePublicNode, networkChainId).methods
}

const parseTimestamp = (timestamp) => parseInt(timestamp, 10) * 1000

export const getProductFromContract = async (
    id: ProductId,
    usePublicNode: boolean = true,
    networkChainId: number,
): SmartContractCall<SmartContractProduct> => (
    call(contractMethods(usePublicNode, networkChainId).getProduct(getValidId(id)))
        .then((result) => {
            if (!result || hexEqualsZero(result.owner)) {
                throw new Error(`No product found with id ${id}`)
            }
            return mapProductFromContract(id, result)
        })
)

export const getMarketplaceEvents = async (
    id: ProductId, eventName: string,
    fromBlock: number = 0,
    usePublicNode: boolean = true,
    networkChainId: number,
) => {
    const abiAndAddress = getMarketplaceAbiAndAddressForNetwork(networkChainId)
    const contract = getContract(abiAndAddress, usePublicNode, networkChainId)
    const events = await contract.getPastEvents(eventName, {
        filter: {
            productId: getValidId(id),
        },
        fromBlock,
        toBlock: 'latest',
    })
    return events
}

export const getSubscriberCount = async (id: ProductId, usePublicNode: boolean = true, networkChainId: number) => {
    const events = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode, networkChainId)
    const validSubs = events.filter((e) => (
        e.returnValues && e.returnValues.endTimestamp && (parseTimestamp(e.returnValues.endTimestamp) > Date.now())
    ))
    return validSubs.length
}

export const getMostRecentPurchaseTimestamp = async (id: ProductId, usePublicNode: boolean = true, networkChainId: number) => {
    const web3 = usePublicNode ? getPublicWeb3(networkChainId) : getWeb3()
    const events = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode, networkChainId)

    if (events.length === 0) {
        return null
    }

    const lastEvent = events[events.length - 1]
    const lastBlock = await web3.eth.getBlock(lastEvent.blockHash)
    if (lastBlock && lastBlock.timestamp) {
        return lastBlock.timestamp * 1000
    }

    return null
}

export const getSubscribedEvents = async (id: ProductId, fromTimestamp: number, usePublicNode: boolean = true, networkChainId: number) => {
    const web3 = usePublicNode ? getPublicWeb3(networkChainId) : getWeb3()
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(fromTimestamp / 1000))
    const events = await getMarketplaceEvents(id, 'Subscribed', fromBlock, usePublicNode, networkChainId)
    const subscriptions = []

    // eslint-disable-next-line no-restricted-syntax
    for (const e of events) {
        // eslint-disable-next-line no-await-in-loop
        const block = await web3.eth.getBlock(e.blockHash)
        if (block && block.timestamp && (block.timestamp * 1000 >= fromTimestamp)) {
            subscriptions.push({
                start: block.timestamp * 1000,
                end: e.returnValues && e.returnValues.endTimestamp && parseTimestamp(e.returnValues.endTimestamp),
            })
        }
    }

    return subscriptions
}

const createContractProductWithoutWhitelist = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
        chainId,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).createProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

const createContractProductWithWhitelist = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
        chainId,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).createProductWithWhitelist(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
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
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
        chainId,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods(false, chainId).updateProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
        redeploy,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const deleteProduct = (id: ProductId, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).deleteProduct(getValidId(id)))
)

export const redeployProduct = (id: ProductId, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).redeployProduct(getValidId(id))) // TODO: figure out the gas for redeploying
)

export const setRequiresWhitelist = (id: ProductId, requiresWhitelist: boolean, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).setRequiresWhitelist(getValidId(id), requiresWhitelist))
)

export const whitelistApprove = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).whitelistApprove(getValidId(id), address))
)

export const whitelistReject = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).whitelistReject(getValidId(id), address))
)

export const whitelistRequest = (id: ProductId, address: Address, networkChainId: number): SmartContractTransaction => (
    send(contractMethods(false, networkChainId).whitelistRequest(getValidId(id), address))
)

export const getWhitelistAddresses = async (id: ProductId, usePublicNode: boolean = true, networkChainId: number): Promise<Array<WhitelistItem>> => {
    const subscriptionEvents = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode, networkChainId)
    const approvedEvents = await getMarketplaceEvents(id, 'WhitelistApproved', 0, usePublicNode, networkChainId)
    const rejectedEvents = await getMarketplaceEvents(id, 'WhitelistRejected', 0, usePublicNode, networkChainId)

    const approvedItems = approvedEvents.map((event) => ({
        address: event.returnValues.subscriber,
        blockNumber: event.blockNumber,
        approved: true,
    }))
    const rejectedItems = rejectedEvents.map((event) => ({
        address: event.returnValues.subscriber,
        blockNumber: event.blockNumber,
        approved: false,
    }))

    const isActiveSubscription = (address) => {
        const activeSubs = subscriptionEvents.filter((e) => (
            e.returnValues &&
            e.returnValues.subscriber === address &&
            e.returnValues.endTimestamp &&
            (parseTimestamp(e.returnValues.endTimestamp) > Date.now())
        ))
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
