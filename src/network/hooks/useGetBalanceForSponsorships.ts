import { getWalletAccount, getWalletWeb3Provider } from '~/shared/stores/wallet'
import getTransactionalClient from '~/getters/getTransactionalClient'
import { BNish } from '~/utils/bn'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'

export const useGetBalanceForSponsorships = (): (() => Promise<BNish>) => {
    return async () => {
        const wallet = await getWalletAccount()
        if (!wallet) {
            return 0
        }

        console.log('env', process.env.HUB_CONFIG_ENV, process.env.NODE_ENV)

        if ((process.env.HUB_CONFIG_ENV || process.env.NODE_ENV) !== 'production') {
            console.log('yo')
            const client = await getTransactionalClient()

            const address = await client.getAddress()
            const provider = await getWalletWeb3Provider()
            return await provider.getBalance(address)
        } else {
            return await getCustomTokenBalance(defaultChainConfig.contracts.DATA, wallet)
        }
    }
}
