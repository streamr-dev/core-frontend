import sumBy from 'lodash/sumBy'
import { OperatorElement } from '~/types/operator'
import { BN } from './bn'

export function getStakeForAddress(
    address: string | undefined,
    operator: OperatorElement | null | undefined,
) {
    if (address == null || operator == null) {
        return BN(0)
    }

    const stakes = operator?.stakes.filter((s) => s.operatorId === address)
    const stakeValue = sumBy(stakes, 'amount')
    return BN(stakeValue)
}
