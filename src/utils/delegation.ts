import { parseEther } from 'ethers/lib/utils'
import { OperatorElement } from '~/types/operator'
import { BN, toBN } from './bn'

export function getDelegationAmountForAddress(
    address: string | undefined,
    operator: OperatorElement | null | undefined,
) {
    if (address == null || operator == null) {
        return BN(0)
    }

    const myDelegations = operator?.delegators.filter(
        (s) => s.delegator.toLowerCase() === address.toLowerCase(),
    )

    return myDelegations?.reduce((previous, current) => {
        return previous.plus(current.amount)
    }, BN(0))
}

export const getOwnerSelfDelegationPercentage = (
    operator: OperatorElement,
    additionalValue?: BN,
): BN => {
    const stake = getDelegationAmountForAddress(operator.owner, operator)
    const operatorValueWithoutEarnings = operator.valueWithoutEarnings.plus(
        additionalValue ?? 0,
    )
    if (stake.isEqualTo(BN(0)) || operatorValueWithoutEarnings.isEqualTo(BN(0))) {
        return BN(0)
    }
    return toBN(
        parseEther(
            stake.dividedBy(operatorValueWithoutEarnings).multipliedBy(100).toString(),
        )
            .div(100)
            .toString(),
    )
}
