import { TokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChain } from '~/shared/web3/config'

export async function getSponsorshipTokenInfo(chainId: number): Promise<TokenInfo> {
    return getTokenInfo(
        getConfigForChain(chainId).contracts[getCoreConfig().sponsorshipPaymentToken],
        chainId,
    )
}
