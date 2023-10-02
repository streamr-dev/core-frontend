import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from './getChainConfig'
import getCoreConfig from './getCoreConfig'
import getSponsorshipTokenInfo from './getSponsorshipTokenInfo'

export type TokenAndBalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
}

export async function getBalanceForSponsorship(wallet: string) {
    return getCustomTokenBalance(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        wallet,
        defaultChainConfig.id,
    )
}
