import { Contract } from 'ethers'
import { StreamrConfig } from 'network-contracts-ethers6'
import { Minute } from '~/consts'
import { ChainConfigKey } from '~/types'
import { getChainConfig } from '~/utils/chains'
import { getContractAbi, getContractAddress } from '~/utils/contracts'
import { getPublicProvider } from '~/utils/providers'

const cache: Record<
    number,
    Partial<Record<ChainConfigKey, { updatedAt: number; value: unknown }>> | undefined
> = {}

const TTL = 60 * Minute

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

    const provider = await getPublicProvider(chainId)

    const contract = new Contract(
        getContractAddress('config', chainId),
        getContractAbi('config'),
        provider,
    ) as unknown as StreamrConfig

    const result = await (async () => {
        try {
            return (await contract[key]()) as U
        } catch (e) {
            if (
                key === 'minimumDelegationSeconds' &&
                chainId === getChainConfig('amoy').id
            ) {
                console.warn('Falling back to minimumDelegationSeconds from Polygon')
                /**
                 * `minimumDelegationSeconds` feature has not been deployed
                 * to Amoy. In the meantime use the value from Polygon.
                 *
                 * @todo Remove this fallback when Amoy is ready.
                 *
                 * @link https://linear.app/streamr/issue/ETH-776/amoy-streamrconfig-contract-address-is-out-of-date
                 */
                return (await getConfigValueFromChain(
                    getChainConfig('polygon').id,
                    key,
                )) as U
            }

            throw e
        }
    })()

    const obj = cache[chainId] || {}

    obj[key] = {
        updatedAt: Date.now(),
        value: result,
    }

    cache[chainId] = obj

    return result
}
