// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'

import type { NumberString, TimeUnit, ContractCurrency as Currency } from '$shared/flowtype/common-types'
import { timeUnits, contractCurrencies as currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import SvgIcon from '$shared/components/SvgIcon'
import PriceField from '$mp/components/PriceField'
import SelectField from '$mp/components/SelectField'

import styles from './setPrice.pcss'

type Props = {
    price: NumberString,
    onPriceChange: (NumberString) => void,
    timeUnit: TimeUnit,
    onTimeUnitChange: (TimeUnit) => void,
    currency: Currency,
    onCurrencyChange: (Currency) => void,
    disabled: boolean,
    className?: string,
    error?: string,
}

const getQuoteCurrencyFor = (currency: Currency) => (
    currency === currencies.DATA ? currencies.USD : currencies.DATA
)

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

const SetPrice = ({
    price,
    onPriceChange: onPriceChangeProp,
    timeUnit,
    onTimeUnitChange,
    currency,
    onCurrencyChange: onCurrencyChangeProp,
    disabled,
    className,
    error,
}: Props) => {
    const [quotePrice, setQuotePrice] = useState(BN(0))

    const onPriceChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onPriceChangeProp(e.target.value)
    }, [onPriceChangeProp])

    const onCurrencyChange = useCallback(() => {
        if (disabled) { return }
        onCurrencyChangeProp(getQuoteCurrencyFor(currency))
    }, [onCurrencyChangeProp, currency, disabled])

    useEffect(() => {
        const quoteAmount = price
        setQuotePrice(quoteAmount)
    }, [price, currency])

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
                        currency={currency}
                        onChange={onPriceChange}
                        disabled={disabled}
                        placeholder="Price"
                        value={price.toString()}
                        error={error}
                        className={styles.input}
                    />
                    <div>
                        <SvgIcon name="transfer" className={styles.icon} onClick={onCurrencyChange} />
                    </div>
                    <PriceField
                        currency={getQuoteCurrencyFor(currency)}
                        placeholder="Price"
                        value={BN(quotePrice).isNaN() ? '0' : quotePrice.toString()}
                        readOnly
                        disabled={disabled}
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
    price: BN(0),
    onPriceChange: () => {},
    timeUnit: timeUnits.hour,
    onTimeUnitChange: () => {},
    currency: DEFAULT_CURRENCY,
    onCurrencyChange: () => {},
    disabled: false,
}

export default SetPrice
