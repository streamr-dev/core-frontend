// @flow

import { I18n } from 'react-redux-i18n'

import { getContract, call, send, hexEqualsZero } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
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

import { getWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'
import { contractCurrencies as currencies, gasLimits } from '$shared/utils/constants'

const contractMethods = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode).methods

export const getProductFromContract = async (id: ProductId, usePublicNode: boolean = false): SmartContractCall<SmartContractProduct> => (
    call(contractMethods(usePublicNode).getProduct(getValidId(id)))
        .then((result) => {
            if (!result || hexEqualsZero(result.owner)) {
                throw new Error(I18n.t('error.productNotFound', {
                    id,
                }))
            }
            return mapProductFromContract(id, result)
        })
)

export const getMarketplaceEvents = async (id: ProductId, eventName: string, fromBlock: number = 0, usePublicNode: boolean = true) => {
    const contract = getContract(getConfig().marketplace, usePublicNode)
    const events = await contract.getPastEvents(eventName, {
        filter: {
            productId: getValidId(id),
        },
        fromBlock,
        toBlock: 'latest',
    })
    return events
}

export const getSubscriberCount = async (id: ProductId, usePublicNode: boolean = true) => {
    const events = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode)
    const validSubs = events.filter((e) => (
        e.returnValues && e.returnValues.endTimestamp && ((e.returnValues.endTimestamp.toNumber() * 1000) > Date.now())
    ))
    return validSubs.length
}

export const getMostRecentPurchaseTimestamp = async (id: ProductId, usePublicNode: boolean = true) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const events = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode)

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

// Seeks blocks starting from 'initialBlockNumberGuess' and checks block timestamps
// until 'targetTimestampMs' is matched.
// Returns best guess when 'maxTries' is reached.
export const seekBlockWithTimestamp = async (
    web3: any,
    initialBlockNumberGuess: number,
    targetTimestampMs: number,
    blockTime: number,
    maxTries: number = 20,
) => {
    const block = await web3.eth.getBlock(initialBlockNumberGuess)
    const diff = block.timestamp - (targetTimestampMs / 1000)

    // Check if this is close enough block
    if (Math.abs(diff) <= blockTime) {
        return block.number
    }

    // Abort if block cannot be found
    if (maxTries <= 0) {
        return block.number
    }

    // Try to find a closer block
    const blocksToSeek = Math.floor(Math.abs(diff) / blockTime)

    if (diff < 0) {
        return seekBlockWithTimestamp(web3, block.number + blocksToSeek, targetTimestampMs, blockTime, maxTries - 1)
    }
    return seekBlockWithTimestamp(web3, block.number - blocksToSeek, targetTimestampMs, blockTime, maxTries - 1)
}

export const calculateBlockNumber = async (web3: any, timestampMs: number) => {
    const latestBlock = await web3.eth.getBlock('latest')
    const firstBlock = await web3.eth.getBlock(1)
    const blockTime = (latestBlock.timestamp - firstBlock.timestamp) / (latestBlock.number - firstBlock.number)
    const secondsBetween = (latestBlock.timestamp - (timestampMs / 1000))
    const blocksToRewind = Math.floor(secondsBetween / blockTime)
    const predictedBlock = latestBlock.number - blocksToRewind

    // Predicted block will not probably be right so make sure we get the right block
    // corresponding to given timestamp
    return seekBlockWithTimestamp(web3, predictedBlock, timestampMs, blockTime)
}

export const getSubscribedEvents = async (id: ProductId, fromTimestamp: number, usePublicNode: boolean = true) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const fromBlock = await calculateBlockNumber(web3, fromTimestamp)
    const events = await getMarketplaceEvents(id, 'Subscribed', fromBlock, usePublicNode)
    const subscriptions = []

    // eslint-disable-next-line no-restricted-syntax
    for (const e of events) {
        // eslint-disable-next-line no-await-in-loop
        const block = await web3.eth.getBlock(e.blockHash)
        if (block && block.timestamp) {
            subscriptions.push({
                start: block.timestamp * 1000,
                end: e.returnValues && e.returnValues.endTimestamp && (e.returnValues.endTimestamp.toNumber() * 1000),
            })
        }
    }

    return subscriptions
}

export const createContractProduct = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods().createProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
    )
    return send(methodToSend, {
        gas: gasLimits.CREATE_PRODUCT,
    })
}

export const createContractProductWithWhitelist = (product: SmartContractProduct): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
        requiresWhitelist,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods().createProductWithWhitelist(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
        requiresWhitelist,
    )
    return send(methodToSend, {
        gas: gasLimits.CREATE_PRODUCT,
    })
}

export const updateContractProduct = (product: SmartContractProduct, redeploy: boolean = false): SmartContractTransaction => {
    const {
        id,
        name,
        beneficiaryAddress,
        pricePerSecond,
        priceCurrency,
        minimumSubscriptionInSeconds,
    } = product
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    validateContractProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(priceCurrency)
    const transformedPricePerSecond = mapPriceToContract(pricePerSecond)
    const methodToSend = contractMethods().updateProduct(
        getValidId(id),
        name,
        beneficiaryAddress,
        transformedPricePerSecond,
        currencyIndex,
        minimumSubscriptionInSeconds,
        redeploy,
    )
    return send(methodToSend, {
        gas: gasLimits.UPDATE_PRODUCT,
    })
}

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(getValidId(id)), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)

export const redeployProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().redeployProduct(getValidId(id))) // TODO: figure out the gas for redeploying
)

export const setRequiresWhitelist = (id: ProductId, requiresWhitelist: boolean): SmartContractTransaction => (
    send(contractMethods(false).setRequiresWhitelist(getValidId(id), requiresWhitelist), {
        gas: gasLimits.SET_REQUIRES_WHITELIST,
    })
)

export const whitelistApprove = (id: ProductId, address: Address): SmartContractTransaction => (
    send(contractMethods(false).whitelistApprove(getValidId(id), address), {
        gas: gasLimits.WHITELIST_OPERATION,
    })
)

export const whitelistReject = (id: ProductId, address: Address): SmartContractTransaction => (
    send(contractMethods(false).whitelistReject(getValidId(id), address), {
        gas: gasLimits.WHITELIST_OPERATION,
    })
)

export const whitelistRequest = (id: ProductId, address: Address): SmartContractTransaction => (
    send(contractMethods(false).whitelistRequest(getValidId(id), address), {
        gas: gasLimits.WHITELIST_OPERATION,
    })
)

export const getWhitelistAddresses = async (id: ProductId, usePublicNode: boolean = true): Promise<Array<WhitelistItem>> => {
    const subscriptionEvents = await getMarketplaceEvents(id, 'Subscribed', 0, usePublicNode)
    const approvedEvents = await getMarketplaceEvents(id, 'WhitelistApproved', 0, usePublicNode)
    const rejectedEvents = await getMarketplaceEvents(id, 'WhitelistRejected', 0, usePublicNode)

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
            ((e.returnValues.endTimestamp.toNumber() * 1000) > Date.now())
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
    }))

    return whitelist
}
