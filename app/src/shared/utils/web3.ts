import { TransactionReceipt } from 'web3-core'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import { Hash } from '$shared/types/web3-types'
import getChainId from '$utils/web3/getChainId'

type CheckNetworkParams = {
    network?: number
}

export const checkEthereumNetworkIsCorrect = async ({
    network
}: CheckNetworkParams = {}): Promise<void> => {
    const currentChainId = await getChainId()

    if (currentChainId == null || network == null || network.toString() !== currentChainId.toString()) {
        throw new WrongNetworkSelectedError(network, currentChainId)
    }
}

export const hasTransactionCompleted = (txHash: Hash, chainId: number): Promise<boolean> =>
    getPublicWeb3(chainId)
        .eth.getTransaction(txHash)
        .then((trx) => !!(trx && trx.blockNumber))

export const getTransactionReceipt = (txHash: Hash, chainId: number): Promise<TransactionReceipt> =>
    getPublicWeb3(chainId)
        .eth.getTransactionReceipt(txHash)
        .then((receipt) => receipt)
