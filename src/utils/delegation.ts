import { parseEther } from 'ethers/lib/utils'
import { OperatorElement } from '~/types/operator'
import { BN, toBN } from './bn'

/**
 * @deprecated Use `getDelegationAmountForAddress2`. It's more flexible
 * and operates on `BN` amounts.
 */
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
    additionalValue = toBN(0),
): BN => {
    const stake = getDelegationAmountForAddress(operator.owner, operator)
    const operatorValueWithoutEarnings =
        operator.valueWithoutEarnings.plus(additionalValue)
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

export function getDelegationAmountForAddress2(
    address: string,
    delegators: { delegator: string; amount: BN }[],
): BN {
    return delegators.reduce(
        (sum, { delegator, amount }) => (delegator === address ? sum.plus(amount) : sum),
        toBN(0),
    )
}
