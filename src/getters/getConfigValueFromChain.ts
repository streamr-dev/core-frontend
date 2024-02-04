import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ConfigKey } from '~/types'
import { getCurrentChain } from '~/getters/getCurrentChain'

const cache: Record<
    number,
    Partial<Record<ConfigKey, { updatedAt: number; value: unknown }>> | undefined
> = {}

const TTL = 60 * 60 * 1000 // 1h

export async function getConfigValueFromChain<
    T extends ConfigKey,
    U extends Awaited<ReturnType<StreamrConfig[T]>>,
>(chainId: number, key: T): Promise<U> {
    const { updatedAt = 0, value } = cache[chainId]?.[key] || {}

    if (value && updatedAt + TTL > Date.now()) {
        return value as U
    }

    const currentChain = getCurrentChain()

    const provider = getPublicWeb3Provider(currentChain.id)

    const contract = new Contract(
        currentChain.contracts.StreamrConfig,
        streamrConfigABI,
        provider,
    ) as StreamrConfig

    const result = (await contract[key]()) as U

    const obj = cache[chainId] || {}

    obj[key] = {
        updatedAt: Date.now(),
        value: result,
    }

    cache[chainId] = obj

    return result
}
