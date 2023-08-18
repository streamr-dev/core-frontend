import { BN } from '~/utils/bn'
import { OperatorElement } from '~/types/operator'

// Compute projected Operator yearly earnings based on its currently yielding Sponsorships
export function calculateOperatorSpotAPY(operator: OperatorElement): BN {
    const operatorIncomePerYear = BN(0)

    const thisOperatorStake = operator.stakes.reduce((a, b) => {
        return a.plus(b.amount)
    }, BN(0))

    operator.stakes.forEach((s) => {
        // Exclude any expired sponsorships
        if (Number.parseInt(s.sponsorship?.projectedInsolvency) * 1000 < Date.now()) {
            const spotApyPercentage = BN(s.sponsorship?.spotAPY).multipliedBy(100)
            operatorIncomePerYear.plus(thisOperatorStake.multipliedBy(spotApyPercentage))
        }
    })

    return operatorIncomePerYear.dividedBy(operator.poolValue)
}
