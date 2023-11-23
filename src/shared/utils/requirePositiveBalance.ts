import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import { getWalletWeb3Provider } from '../stores/wallet'

export default async function requirePositiveBalance(address: string) {
    const provider = await getWalletWeb3Provider()

    const balance = await provider.getBalance(address)

    if (balance.lte(0)) {
        throw new InsufficientFundsError(address)
    }
}
