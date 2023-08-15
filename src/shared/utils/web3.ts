import WrongNetworkSelectedError from '~/shared/errors/WrongNetworkSelectedError'
import getChainId from '~/utils/web3/getChainId'

type CheckNetworkParams = {
    network?: number
}

export const checkEthereumNetworkIsCorrect = async ({
    network,
}: CheckNetworkParams = {}): Promise<void> => {
    const currentChainId = await getChainId()

    if (
        currentChainId == null ||
        network == null ||
        network.toString() !== currentChainId.toString()
    ) {
        throw new WrongNetworkSelectedError(network, currentChainId)
    }
}
