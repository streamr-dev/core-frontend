import { Contract } from 'ethers'
import { StreamrConfig, streamrConfigABI } from '@streamr/network-contracts'
import { getSigner } from '~/shared/stores/wallet'
import { BNish } from '~/utils/bn'
import { errorToast } from '~/utils/toast'
import { defaultChainConfig } from './getChainConfig'

/**
 * When we will be needing more of the fields, simply expand the return type and add them
 */
export const getConfigFromChain = async (): Promise<{
    maxPenaltyPeriodSeconds: BNish
    minimumStakeWei: BNish
} | null> => {
    const signer = await getSigner()
    const config = new Contract(
        defaultChainConfig.contracts.StreamrConfig,
        streamrConfigABI,
        signer,
    ) as StreamrConfig
    try {
        return {
            maxPenaltyPeriodSeconds: await config.maxPenaltyPeriodSeconds(),
            minimumStakeWei: await config.minimumStakeWei(),
        }
    } catch (e) {
        errorToast({
            title: 'Could not load data from the chain, please try again later.',
        })
        return null
    }
}
