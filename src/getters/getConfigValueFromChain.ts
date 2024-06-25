import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from 'network-contracts-ethers6'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ChainConfigKey } from '~/types'
import { getChainConfig } from '~/utils/chains'

const cache: Record<
    number,
    Partial<Record<ChainConfigKey, { updatedAt: number; value: unknown }>> | undefined
> = {}

const TTL = 60 * 60 * 1000 // 1h

/**
 * @todo Refactor to use `fetchQuery` for cache.
 */
export async function getConfigValueFromChain<
    T extends ChainConfigKey,
    U extends Awaited<ReturnType<StreamrConfig[T]>>,
>(chainId: number, key: T): Promise<U> {
    const { updatedAt = 0, value } = cache[chainId]?.[key] || {}

    if (value && updatedAt + TTL > Date.now()) {
        return value as U
    }

    const chain = getChainConfig(chainId)

    const provider = getPublicWeb3Provider(chainId)

    const { StreamrConfig: contractAddress } = chain.contracts

    if (!contractAddress) {
        throw new Error(
            `StreamrConfig contract address is required for chain ${chain.id}`,
        )
    }

    const contract = new Contract(
        contractAddress,
        streamrConfigABI,
        provider,
    ) as unknown as StreamrConfig

    const result = (await contract[key]()) as U

    const obj = cache[chainId] || {}

    obj[key] = {
        updatedAt: Date.now(),
        value: result,
    }

    cache[chainId] = obj

    return result
}
