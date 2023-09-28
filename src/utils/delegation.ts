import sumBy from 'lodash/sumBy'
import { OperatorElement } from '~/types/operator'
import { BN } from './bn'

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
