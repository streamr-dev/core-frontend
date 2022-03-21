import { getEthBalance } from '$mp/utils/web3'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'

export default async function requirePositiveBalance(address) {
    const balance = await getEthBalance(address)

    if (balance.isGreaterThan(0)) {
        return
    }

    throw new InsufficientFundsError(address)
}
