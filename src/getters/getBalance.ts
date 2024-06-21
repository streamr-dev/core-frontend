import { BN } from '~/utils/bn'
import getChainId from '~/utils/web3/getChainId'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { getChainConfig } from '~/utils/chains'

export const getBalance = async (
    address: string,
    tokenSymbol = 'DATA',
    options: { chainId?: number } = {},
): Promise<BN> => {
    const chainId = options.chainId || (await getChainId())

    const chainConfig = getChainConfig(chainId)

    return await getCustomTokenBalance(
        chainConfig.contracts[tokenSymbol],
        address,
        chainId,
    )
}
