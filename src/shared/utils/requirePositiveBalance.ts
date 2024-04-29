import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'

export async function requirePositiveBalance(chainId: number, address: string) {
    const provider = getPublicWeb3Provider(chainId)

    const balance = await provider.getBalance(address)

    if (balance > 0) {
        throw new InsufficientFundsError(address)
    }
}
