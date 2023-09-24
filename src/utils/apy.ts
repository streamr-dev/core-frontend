import { BN, toBN } from '~/utils/bn'
import { OperatorElement } from '~/types/operator'

/**
 * Compute projected Operator yearly earnings based on its currently yielding Sponsorships.
 * @deprecated Use `getSpotApy`. It's faster, more flexible and accurate.
 */
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

    return operatorIncomePerYear.isEqualTo(BN(0)) ||
        operator.valueWithoutEarnings.isEqualTo(BN(0))
        ? BN(0)
        : operatorIncomePerYear.dividedBy(operator.valueWithoutEarnings)
}

/**
 * Compute projected yearly earnings based on the current yield.
 * @param poolValue Total value of the pool.
 * @param stakes Collection of basic stake information (amount, spot apy, projected insolvency date).
 * @returns Number between 0 and 1 (inclusive) representing the APY. 0 = 0%, 1 = 100%.
 */
export function getSpotApy(
    poolValue: BN,
    stakes: { amount: BN; spotAPY: BN; projectedInsolvencyAt: number }[],
): number {
    if (poolValue.isEqualTo(0)) {
        return 0
    }

    const stake = stakes.reduce((sum, { amount }) => sum.plus(amount), toBN(0))

    const now = Date.now()

    const yearlyIncome = stakes.reduce((sum, { spotAPY, projectedInsolvencyAt }) => {
        /**
         * Only include sponsorships that haven't expired.
         */
        return projectedInsolvencyAt * 1000 < now
            ? sum.plus(stake.multipliedBy(spotAPY))
            : sum
    }, toBN(0))

    if (yearlyIncome.isEqualTo(0)) {
        return 0
    }

    return yearlyIncome.dividedBy(poolValue).toNumber()
}
