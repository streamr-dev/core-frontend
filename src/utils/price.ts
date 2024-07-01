import { toSeconds } from '~/marketplace/utils/time'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { BN, toBN, toBigInt } from '~/utils/bn'

interface ConvertPriceOptions {
    roundingMode?: BN.RoundingMode
}

/**
 * Converts price per unit into price per given quantity of another unit.
 * @param value An amount/unit pair. If just the amount is given the unit defaults to seconds.
 * @param target A quantity/unit pair. If just the unit is given the quantity default to 1.
 */
export function convertPrice(
    value: [amount: bigint, unit: TimeUnit] | bigint,
    target: [quantity: number, unit: TimeUnit] | TimeUnit,
    { roundingMode = BN.ROUND_HALF_UP }: ConvertPriceOptions = {},
) {
    const [valueAmount, valueUnit] =
        typeof value === 'bigint' ? [value, timeUnits.second] : value

    const [targetQuantity, targetUnit] =
        typeof target === 'string'
            ? [1, target]
            : typeof target === 'number'
            ? [target, timeUnits.second]
            : target

    return toBigInt(
        toBN(valueAmount)
            .dividedBy(toSeconds(1, valueUnit))
            .multipliedBy(toSeconds(targetQuantity, targetUnit))
            .dp(0, roundingMode),
    )
}
