import { TokenInfo, getTokenInfo } from '~/utils/tokens'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'

export async function getSponsorshipTokenInfo(chainId: number): Promise<TokenInfo> {
    const { sponsorshipPaymentToken } = getChainConfigExtension(chainId)

    return getTokenInfo(
        getChainConfig(chainId).contracts[sponsorshipPaymentToken],
        chainId,
    )
}
