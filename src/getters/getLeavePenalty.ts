import { Contract } from 'ethers'
import { Sponsorship, sponsorshipABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { BNish } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'

export const getLeavePenalty = async (
    operatorAddress: string,
    sponsorshipAddress: string,
): Promise<BNish> => {
    const contract = new Contract(
        sponsorshipAddress,
        sponsorshipABI,
        getPublicWeb3Provider(defaultChainConfig.id),
    ) as Sponsorship

    return await contract.getLeavePenalty(operatorAddress)
}
