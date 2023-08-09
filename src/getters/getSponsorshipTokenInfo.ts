import { getTokenInformation, TokenInformation } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'

export const getSponsorshipTokenInfo = async (): Promise<TokenInformation> => {
    const tokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken
    return await getTokenInformation(
        defaultChainConfig.contracts[tokenSymbolFromConfig],
        defaultChainConfig.id,
    )
}
