import { getNativeTokenBalance } from '$mp/utils/web3'
import InsufficientFundsError from '$shared/errors/InsufficientFundsError'
import { Address } from "$shared/types/web3-types"
export default async function requirePositiveBalance(address: Address): Promise<void> {
    const balance = await getNativeTokenBalance(address)

    if (balance.isGreaterThan(0)) {
        return
    }

    throw new InsufficientFundsError(address)
}
