import { TokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'
import { getCurrentChain } from './getCurrentChain'

export default async function getSponsorshipTokenInfo(): Promise<TokenInfo> {
    const chainConfig = getCurrentChain()
    return getTokenInfo(
        chainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        chainConfig.id,
    )
}
