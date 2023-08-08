import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { BNish } from '~/utils/bn'
import { defaultChainConfig } from './getChainConfig'

/**
 * When we will be needing more of the fields, simply expand the return type and add them
 */
export const getConfigFromChain = async (): Promise<{
    maxPenaltyPeriodSeconds: BNish
    minimumStakeWei: BNish
}> => {
    const signer = await getPublicWeb3Provider(defaultChainConfig.id).getSigner()
    const config = new Contract(
        defaultChainConfig.contracts.StreamrConfig,
        streamrConfigABI,
        signer,
    ) as StreamrConfig
    return {
        maxPenaltyPeriodSeconds: await config.maxPenaltyPeriodSeconds(),
        minimumStakeWei: await config.minimumStakeWei(),
    }
}
