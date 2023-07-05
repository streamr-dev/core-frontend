import { getNativeTokenBalance } from '~/marketplace/utils/web3'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'

export default async function requirePositiveBalance(address: string) {
    const balance = await getNativeTokenBalance(address)

    if (balance.isGreaterThan(0)) {
        return
    }

    throw new InsufficientFundsError(address)
}
