import { Contract } from 'ethers'
import { Sponsorship } from 'network-contracts-ethers6'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { toBN } from '~/utils/bn'
import { getContractAbi } from '~/utils/contracts'
import { getPublicProvider } from '~/utils/providers'

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

    return operatorStake != null && operatorStake.amountWei > 0n
}

/**
 * Gets the current Sponsorship leave penalty for a given Operator.
 */
export async function getSponsorshipLeavePenalty(
    chainId: number,
    sponsorshipId: string,
    operatorId: string,
) {
    const provider = await getPublicProvider(chainId)

    const contract = new Contract(
        sponsorshipId,
        getContractAbi('sponsorship'),
        provider,
    ) as unknown as Sponsorship

    return contract.getLeavePenalty(operatorId)
}

export function getSponsorshipExtensionInDays(
    amount: bigint,
    dailyPayoutRate: bigint,
): number {
    return dailyPayoutRate > 0n && amount >= 0n
        ? toBN(amount).dividedBy(toBN(dailyPayoutRate)).toNumber()
        : 0
}
