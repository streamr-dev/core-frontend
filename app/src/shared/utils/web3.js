// @flow

import { I18n } from 'react-redux-i18n'

import { StreamrWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import { ethereumNetworks } from '$shared/utils/constants'
import { WrongNetworkSelectedError } from '$shared/errors/Web3/index'
import type { Hash } from '$shared/flowtype/web3-types'

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const { networkId: requiredNetwork } = getConfig()
        const requiredNetworkName = ethereumNetworks[requiredNetwork] || I18n.t('shared.errors.networkName', {
            networkId: requiredNetwork,
        })
        const currentNetworkName = ethereumNetworks[network] || I18n.t('shared.errors.networkName', {
            networkId: network,
        })
        if (network.toString() !== requiredNetwork.toString()) {
            throw new WrongNetworkSelectedError(requiredNetworkName, currentNetworkName)
        }
    })

export const hasTransactionCompleted = (txHash: Hash): Promise<boolean> => {
    const web3 = getPublicWeb3()

    return web3.eth.getTransaction(txHash)
        .then((trx) => !!(trx && trx.blockNumber))
}

/**
 * Estimates time it takes to mine one block on the blockchain by counting the average time
 * between the current and the given amount of previous blocks.
 *
 * @param {*} web3Instance Web3 instance
 * @param {*} blocksAgo How many previous blocks to include
 */
export const averageBlockTime = async (web3Instance: StreamrWeb3, blocksAgo: number = 500) => {
    // Get the current block number
    const currentBlockNumber = await web3Instance.eth.getBlockNumber()
    const numberOfBlocks = Math.min(currentBlockNumber, blocksAgo)

    // Get the current block
    const currentBlock = await web3Instance.eth.getBlock(currentBlockNumber)

    // Get the block X number of blocks ago
    const thenBlock = await web3Instance.eth.getBlock(currentBlockNumber - numberOfBlocks)

    // Take the average of the then and now timestamps
    const divider = numberOfBlocks > 0 ? numberOfBlocks : 1
    return (currentBlock.timestamp - thenBlock.timestamp) / divider
}
