import { getERC20TokenContract } from '~/getters'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'

interface GetBalanceOptions {
    chainId: number
    tokenAddress: 'native' | (string & {})
    walletAddress: string
}

export function getBalance({
    chainId,
    tokenAddress,
    walletAddress,
}: GetBalanceOptions): Promise<bigint> {
    const provider = getPublicWeb3Provider(chainId)

    if (tokenAddress === 'native') {
        return provider.getBalance(walletAddress)
    }

    const contract = getERC20TokenContract({
        tokenAddress,
        provider,
    })

    return contract.balanceOf(walletAddress)
}
