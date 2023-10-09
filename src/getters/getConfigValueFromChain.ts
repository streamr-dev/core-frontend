import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ConfigKey } from '~/types'
import { defaultChainConfig } from '~/getters/getChainConfig'

const cache: Partial<Record<ConfigKey, { updatedAt: number; value: unknown }>> = {}

const TTL = 60 * 60 * 1000 // 1h

export async function getConfigValueFromChain<
    T extends ConfigKey,
    U extends Awaited<ReturnType<StreamrConfig[T]>>,
>(key: T): Promise<U> {
    const { updatedAt = 0, value } = cache[key] || {}

    if (value && updatedAt + TTL > Date.now()) {
        return value as U
    }

    const provider = getPublicWeb3Provider(defaultChainConfig.id)

    const contract = new Contract(
        defaultChainConfig.contracts.StreamrConfig,
        streamrConfigABI,
        provider,
    ) as StreamrConfig

    const result = (await contract[key]()) as U

    cache[key] = {
        updatedAt: Date.now(),
        value: result,
    }

    return result
}
