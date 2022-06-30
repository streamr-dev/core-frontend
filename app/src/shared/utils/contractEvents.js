// @flow

import type { Web3 } from 'web3'

export async function* getContractEvents(
    web3: Web3,
    contractAbi: any,
    contractAddress: string,
    chainId: number,
    eventName: string,
    fromBlock: number,
    filter: Object = undefined,
): any {
    const contract = new web3.eth.Contract(contractAbi, contractAddress)
    const latestBlock = await web3.eth.getBlock('latest')

    // Get events in batches since xDai RPC seems to timeout if fetching too large sets
    const batchSize = 10000

    for (let blockNumber = fromBlock; blockNumber < latestBlock.number; blockNumber += (batchSize + 1)) {
        let toBlockNumber = blockNumber + batchSize
        if (toBlockNumber > latestBlock.number) {
            toBlockNumber = latestBlock.number
        }

        // eslint-disable-next-line no-await-in-loop
        const events = await contract.getPastEvents(eventName, {
            fromBlock: blockNumber,
            toBlock: toBlockNumber,
            filter,
        })
        yield events
    }
}
