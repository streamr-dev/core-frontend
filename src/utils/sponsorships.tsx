import { Sponsorship, sponsorshipABI } from '@streamr/network-contracts'
import { Contract } from 'ethers'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { toBN } from '~/utils/bn'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import getCoreConfig from '~/getters/getCoreConfig'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { getCurrentChain, getCurrentChainId } from '~/getters/getCurrentChain'

/**
 * Scouts for Operator's funding share.
 */
export function getSponsorshipStakeForOperator(
    stakes: ParsedSponsorship['stakes'],
    operatorId: string,
) {
    return stakes.find((stake) => stake.operatorId === operatorId)
}

/**
 * Checks if a given Operator funds a given Sponsorship.
 */
export function isSponsorshipFundedByOperator(
    sponsorship: ParsedSponsorship,
    operator: ParsedOperator | null,
): boolean {
    if (operator == null) {
        return false
    }

    const operatorStake = getSponsorshipStakeForOperator(sponsorship.stakes, operator.id)
    return operatorStake != null && operatorStake.amount.isGreaterThan(0)
}

/**
 * Gets the current Sponsorship leave penalty for a given Operator.
 */
export async function getSponsorshipLeavePenalty(
    sponsorshipId: string,
    operatorId: string,
) {
    const chainId = getCurrentChainId()

    const contract = new Contract(
        sponsorshipId,
        sponsorshipABI,
        getPublicWeb3Provider(chainId),
    ) as Sponsorship

    return toBN(await contract.getLeavePenalty(operatorId))
}

/**
 * Fetches wallet's balance of the Sponsorship-native token
 * on the default chain.
 */
export async function getBalanceForSponsorship(wallet: string) {
    const chainConfig = getCurrentChain()
    return getCustomTokenBalance(
        chainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        wallet,
        chainConfig.id,
    )
}
