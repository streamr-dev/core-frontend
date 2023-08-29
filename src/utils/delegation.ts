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

    const myDelegations = operator?.delegators.filter((s) => s.delegator === address)
    const value = sumBy(myDelegations, 'amount')
    return BN(value)
}
