import { TokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import { getConfigForChain } from '~/shared/web3/config'
import { getChainConfigExtension } from './getChainConfigExtension'

export async function getSponsorshipTokenInfo(chainId: number): Promise<TokenInfo> {
    const { sponsorshipPaymentToken } = getChainConfigExtension(chainId)

    return getTokenInfo(
        getConfigForChain(chainId).contracts[sponsorshipPaymentToken],
        chainId,
    )
}
