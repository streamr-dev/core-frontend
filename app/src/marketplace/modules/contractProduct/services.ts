import { call, send, hexEqualsZero } from '$mp/utils/smartContract'
import type { SmartContractProduct, ProjectId } from '$mp/types/project-types'
import type { SmartContractCall, SmartContractTransaction, Address } from '$shared/types/web3-types'
import { getValidId, mapProductFromContract, validateContractProductPricePerSecond } from '$mp/utils/product'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { marketplaceContract, getMarketplaceAbiAndAddress, getCustomTokenDecimals } from '$mp/utils/web3'
import { getContractEvents } from '$shared/utils/contractEvents'
import getCoreConfig from '$app/src/getters/getCoreConfig'

const contractMethods = (usePublicNode = false, networkChainId: number) => marketplaceContract(usePublicNode, networkChainId).methods

const parseTimestamp = (timestamp: string) => parseInt(timestamp, 10) * 1000

const getMarketplaceContractCreationBlock = (chainId: number): number => {
    const map = getCoreConfig().marketplaceContractCreationBlocks
    // TODO add typing
    const blockItem = map.find((i: any) => i.chainId === chainId)

    if (blockItem == null || blockItem.blockNumber == null) {
        throw new Error('No marketplaceContractCreationBlocks defined in config for this chain!')
    }

    return blockItem.blockNumber
}

export const getProductFromContract = async (
    id: ProjectId,
    usePublicNode = true,
    networkChainId: number,
): SmartContractCall<SmartContractProduct> => {
    const result = await call(contractMethods(usePublicNode, networkChainId).getProduct(getValidId(id)))

    if (!result || hexEqualsZero(result.owner)) {
        throw new Error(`No product found with id ${id}`)
    }

    const pricingTokenDecimals = await getCustomTokenDecimals(result.pricingTokenAddress, networkChainId)
    return mapProductFromContract(id, result, networkChainId, pricingTokenDecimals)
}

async function* getMarketplaceEvents(id: ProjectId, eventName: string, fromBlock = 0, chainId: number): any {
    const web3 = getPublicWeb3(chainId)
    const abiAndAddress = getMarketplaceAbiAndAddress(chainId)
    const filter = {
        productId: getValidId(id),
    }
    yield* getContractEvents(web3, abiAndAddress.abi, abiAndAddress.address, chainId, eventName, fromBlock, filter)
}

export const getSubscribedEvents = async (
    id: ProjectId,
    fromTimestamp: number,
    usePublicNode = true,
    networkChainId: number
): Promise<{ start: number, end: number }[]> => {
    const web3 = usePublicNode ? getPublicWeb3(networkChainId) : getWeb3()
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(fromTimestamp / 1000))
    const subscriptions = []

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const e of getMarketplaceEvents(id, 'Subscribed', fromBlock, networkChainId)) {
        for (const subEvent of e) {
            const block = await web3.eth.getBlock(subEvent.blockHash)

            if (block && block.timestamp && Number(block.timestamp) * 1000 >= fromTimestamp) {
                subscriptions.push({
                    start: Number(block.timestamp) * 1000,
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

    return createContractProductWithoutWhitelist(product)
}
export const updateContractProduct = (product: SmartContractProduct, redeploy = false): SmartContractTransaction => {
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
export const deleteProduct = (id: ProjectId, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).deleteProduct(getValidId(id)), {
        network: networkChainId,
    })
export const redeployProduct = (id: ProjectId, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).redeployProduct(getValidId(id)), {
        network: networkChainId,
    }) // TODO: figure out the gas for redeploying
export const setRequiresWhitelist = (id: ProjectId, requiresWhitelist: boolean, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).setRequiresWhitelist(getValidId(id), requiresWhitelist), {
        network: networkChainId,
    })
export const whitelistApprove = (id: ProjectId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistApprove(getValidId(id), address), {
        network: networkChainId,
    })
export const whitelistReject = (id: ProjectId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistReject(getValidId(id), address), {
        network: networkChainId,
    })
export const whitelistRequest = (id: ProjectId, address: Address, networkChainId: number): SmartContractTransaction =>
    send(contractMethods(false, networkChainId).whitelistRequest(getValidId(id), address), {
        network: networkChainId,
    })
/**
 * @deprecated
 * @param id
 * @param networkChainId
 */
export const getWhitelistAddresses = async (id: ProjectId, networkChainId: number): Promise<Array<WhitelistItem>> => {
    return []
}
export const isAddressWhitelisted = async (id: ProjectId, address: Address, usePublicNode = true, networkChainId: number): Promise<boolean> => {
    const isWhitelistStatus = await call(contractMethods(usePublicNode, networkChainId).getWhitelistState(getValidId(id), address))
    return !!(isWhitelistStatus === 2)
}
