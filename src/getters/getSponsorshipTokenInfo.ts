import { TokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'

export const getSponsorshipTokenInfo = async (): Promise<TokenInfo | null> => {
    return await getTokenInfo(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        defaultChainConfig.id,
    )
}
