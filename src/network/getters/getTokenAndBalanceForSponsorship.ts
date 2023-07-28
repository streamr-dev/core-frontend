import getCoreConfig from '~/getters/getCoreConfig'
import { getCustomTokenBalance, getTokenInformation } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { getWalletAccount } from '~/shared/stores/wallet'

export type TokenAndBalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
}

export const getTokenAndBalanceForSponsorship =
    async (): Promise<TokenAndBalanceForSponsorship | null> => {
        const walletAddress = await getWalletAccount()
        if (!walletAddress) {
            return null
        }
        const tokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken as string
        const tokenInformation = await getTokenInformation(
            defaultChainConfig.contracts[tokenSymbolFromConfig],
        )
        if (!tokenInformation) {
            throw new Error('Invalid token for sponsorship balanance')
        }
        const balance = await getCustomTokenBalance(
            defaultChainConfig.contracts[tokenSymbolFromConfig],
            walletAddress,
        )
        return {
            balance: balance.toString(), // human readable value (wei / decimals)
            tokenSymbol: tokenInformation.symbol,
            tokenDecimals: Number(tokenInformation.decimals.toString()),
        }
    }
