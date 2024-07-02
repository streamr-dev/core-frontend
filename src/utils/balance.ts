import { getERC20TokenContract } from '~/getters'
import { getPublicProvider } from '~/utils/providers'

interface GetBalanceOptions {
    chainId: number
    tokenAddress: 'native' | (string & {})
    walletAddress: string
}

export async function getBalance({
    chainId,
    tokenAddress,
    walletAddress,
}: GetBalanceOptions): Promise<bigint> {
    const provider = await getPublicProvider(chainId)

    if (tokenAddress === 'native') {
        return provider.getBalance(walletAddress)
    }

    const contract = getERC20TokenContract({
        tokenAddress,
        provider,
    })

    return contract.balanceOf(walletAddress)
}
