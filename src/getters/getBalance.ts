import { BN } from '~/utils/bn'
import getChainId from '~/utils/web3/getChainId'
import { getConfigForChain } from '~/shared/web3/config'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'

export const getBalance = async (address: string, tokenSymbol = 'DATA'): Promise<BN> => {
    const chainId = await getChainId()
    const chainConfig = getConfigForChain(chainId)
    return await getCustomTokenBalance(
        chainConfig.contracts[tokenSymbol],
        address,
        chainId,
    )
}
