import { getWalletAccount } from '~/shared/stores/wallet'
import { getCustomTokenBalance, getTokenInformation } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'
import { BNish } from '~/utils/bn'

export type BalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
} | null
export const useGetBalanceForSponsorships =
    (): (() => Promise<BalanceForSponsorship>) => {
        return async () => {
            const wallet = await getWalletAccount()
            if (!wallet) {
                return null
            }
            const tokenSymbolFromConfig = getCoreConfig()
                .sponsorshipPaymentToken as string
            const tokenInformation = await getTokenInformation(
                defaultChainConfig.contracts[tokenSymbolFromConfig],
            )
            if (!tokenInformation) {
                throw new Error('Invalid token for sponsorship balanance')
            }
            const balance = await getCustomTokenBalance(
                defaultChainConfig.contracts[tokenSymbolFromConfig],
                wallet,
            )
            return {
                balance: balance.toString(),
                tokenSymbol: tokenInformation.symbol,
                tokenDecimals: Number(tokenInformation.decimals.toString()),
            }
        }
    }
