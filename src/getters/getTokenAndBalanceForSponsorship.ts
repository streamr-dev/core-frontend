import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from './getChainConfig'
import getCoreConfig from './getCoreConfig'
import getSponsorshipTokenInfo from './getSponsorshipTokenInfo'

export type TokenAndBalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
}

export const getTokenAndBalanceForSponsorship = async (
    walletAddress: string,
): Promise<TokenAndBalanceForSponsorship> => {
    const tokenInformation = await getSponsorshipTokenInfo()

    const balance = await getCustomTokenBalance(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        walletAddress,
        defaultChainConfig.id,
    )
    return {
        balance: balance.toString(), // human readable value (wei / decimals)
        tokenSymbol: tokenInformation.symbol,
        tokenDecimals: Number(tokenInformation.decimals.toString()),
    }
}
