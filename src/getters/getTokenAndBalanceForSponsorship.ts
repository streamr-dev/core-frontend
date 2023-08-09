import getCoreConfig from '~/getters/getCoreConfig'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { getSponsorshipTokenInfo } from './getSponsorshipTokenInfo'

export type TokenAndBalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
}

export const getTokenAndBalanceForSponsorship = async (
    walletAddress: string,
): Promise<TokenAndBalanceForSponsorship> => {
    const tokenInformation = await getSponsorshipTokenInfo()

    if (!tokenInformation) {
        throw new Error('Invalid token for sponsorship balanance')
    }
    const balance = await getCustomTokenBalance(
        defaultChainConfig.contracts[tokenInformation.symbol],
        walletAddress,
        defaultChainConfig.id,
    )
    return {
        balance: balance.toString(), // human readable value (wei / decimals)
        tokenSymbol: tokenInformation.symbol,
        tokenDecimals: Number(tokenInformation.decimals.toString()),
    }
}
