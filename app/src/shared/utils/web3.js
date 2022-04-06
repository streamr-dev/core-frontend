// @flow

import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import getWeb3 from '$utils/web3/getWeb3'
import { networks } from '$shared/utils/constants'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import type { Hash } from '$shared/flowtype/web3-types'
import getChainId from '$utils/web3/getChainId'

type CheckNetworkParams = {
    network?: number,
}

export const checkEthereumNetworkIsCorrect = async ({ network = networks.MAINNET }: CheckNetworkParams = {}): Promise<void> => {
    const currentChainId = await getChainId()

    if (currentChainId == null || network.toString() !== currentChainId.toString()) {
        // $FlowFixMe: currentChainId: "Promise is incompatible with number", nope
        throw new WrongNetworkSelectedError(network, currentChainId)
    }
}

export const hasTransactionCompleted = (txHash: Hash): Promise<boolean> => (
    getPublicWeb3().eth.getTransaction(txHash).then((trx) => !!(trx && trx.blockNumber))
)

/**
 * Estimates time it takes to mine one block on the blockchain by counting the average time
 * between the current and the given amount of previous blocks.
 *
 * @param {*} blocksAgo How many previous blocks to include
 */
export const averageBlockTime = async (blocksAgo: number = 500) => {
    const web3 = getWeb3()

    // Get the current block number
    const currentBlockNumber = await web3.eth.getBlockNumber()
    const numberOfBlocks = Math.min(currentBlockNumber, blocksAgo)

    // Get the current block
    const currentBlock = await web3.eth.getBlock(currentBlockNumber)

    // Get the block X number of blocks ago
    const thenBlock = await web3.eth.getBlock(currentBlockNumber - numberOfBlocks)

    // Take the average of the then and now timestamps
    const divider = numberOfBlocks > 0 ? numberOfBlocks : 1
    return (currentBlock.timestamp - thenBlock.timestamp) / divider
}
