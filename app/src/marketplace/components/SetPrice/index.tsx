import React, { ChangeEvent, useCallback, useMemo } from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'
import { NumberString, TimeUnit } from '$shared/types/common-types'
import { timeUnits } from '$shared/utils/constants'
import PriceField from '$mp/components/PriceField'
import SelectField from '$mp/components/SelectField'
import styles from './setPrice.pcss'
type Props = {
    price: NumberString
    onPriceChange: (arg0: NumberString) => void
    timeUnit: TimeUnit
    onTimeUnitChange: (arg0: TimeUnit) => void
    pricingTokenAddress: string
    disabled: boolean
    className?: string
    error?: string
    chainId: number
}
const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

const SetPrice = ({
    price,
    onPriceChange: onPriceChangeProp,
    timeUnit,
    onTimeUnitChange,
    pricingTokenAddress,
    disabled,
    className,
    error,
    chainId,
}: Props) => {
    const onPriceChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onPriceChangeProp(e.target.value)
        },
        [onPriceChangeProp],
    )
    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])
    return (
        <div className={cx(styles.root, className)}>
            <div
                className={cx({
                    [styles.disabled]: disabled,
                })}
            >
                <div className={styles.priceControls}>
                    <PriceField
                        pricingTokenAddress={pricingTokenAddress}
                        chainId={chainId}
                        onChange={onPriceChange}
                        disabled={disabled}
                        placeholder="Price"
                        value={price.toString()}
                        error={error}
                        className={styles.input}
                    />
                    <div>
                        <span className={styles.per}>per</span>
                    </div>
                    <SelectField
                        placeholder="Select"
                        options={options}
                        value={selectedValue}
                        onChange={({ value: nextValue }) => onTimeUnitChange(nextValue)}
                        disabled={disabled}
                        className={styles.select}
                    />
                </div>
            </div>
        </div>
    )
}

SetPrice.defaultProps = {
    price: new BN(0),
    onPriceChange: () => {},
    timeUnit: timeUnits.hour,
    onTimeUnitChange: () => {},
    pricingTokenAddress: null,
    disabled: false,
}
export default SetPrice
