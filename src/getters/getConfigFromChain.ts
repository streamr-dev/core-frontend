import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { BNish } from '~/utils/bn'
import { defaultChainConfig } from './getChainConfig'

export type ConfigFromChain = { maxPenaltyPeriodSeconds: BNish; minimumStakeWei: BNish }
/**
 * When we will be needing more of the fields, simply expand the return type and add them
 */
export const getConfigFromChain = async (): Promise<ConfigFromChain> => {
    const provider = await getPublicWeb3Provider(defaultChainConfig.id)
    const config = new Contract(
        defaultChainConfig.contracts.StreamrConfig,
        streamrConfigABI,
        provider,
    ) as StreamrConfig
    return {
        maxPenaltyPeriodSeconds: await config.maxPenaltyPeriodSeconds(),
        minimumStakeWei: await config.minimumStakeWei(),
    }
}
