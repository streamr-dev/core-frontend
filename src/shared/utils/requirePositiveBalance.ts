import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import { getBalance } from '~/utils/balance'

export async function requirePositiveBalance(chainId: number, walletAddress: string) {
    const balance = await getBalance({
        chainId,
        tokenAddress: 'native',
        walletAddress,
    })

    if (balance > 0) {
        throw new InsufficientFundsError(walletAddress)
    }
}
