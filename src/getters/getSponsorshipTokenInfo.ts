import { TokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'

export default async function getSponsorshipTokenInfo(): Promise<TokenInfo | null> {
    return getTokenInfo(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        defaultChainConfig.id,
    )
}
