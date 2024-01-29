import { Contract } from 'ethers'
import { Sponsorship, sponsorshipABI } from '@streamr/network-contracts'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { BNish } from '~/utils/bn'
import { getCurrentChainId } from './getCurrentChain'

export const getLeavePenalty = async (
    operatorAddress: string,
    sponsorshipAddress: string,
): Promise<BNish> => {
    const contract = new Contract(
        sponsorshipAddress,
        sponsorshipABI,
        getPublicWeb3Provider(getCurrentChainId()),
    ) as Sponsorship

    return await contract.getLeavePenalty(operatorAddress)
}
