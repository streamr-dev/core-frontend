// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'

import type { NumberString, TimeUnit, Currency } from '$shared/flowtype/common-types'
import { timeUnits, currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { convert } from '$mp/utils/price'
import Dropdown from '$shared/components/Dropdown'
import SvgIcon from '$shared/components/SvgIcon'
import PriceField from '$mp/components/PriceField'

import styles from './setPrice.pcss'

type Props = {
    price: NumberString,
    onPriceChange: (NumberString) => void,
    timeUnit: TimeUnit,
    onTimeUnitChange: (TimeUnit) => void,
    currency: Currency,
    onCurrencyChange: (Currency) => void,
    dataPerUsd: NumberString,
    disabled: boolean,
    className?: string,
    error?: string,
}

const getQuoteCurrencyFor = (currency: Currency) => (
    currency === currencies.DATA ? currencies.USD : currencies.DATA
)

const SetPrice = ({
    price,
    onPriceChange: onPriceChangeProp,
    timeUnit,
    onTimeUnitChange,
    currency,
    onCurrencyChange: onCurrencyChangeProp,
    dataPerUsd,
    disabled,
    className,
    error,
}: Props) => {
    const [quotePrice, setQuotePrice] = useState(BN(0))

    const onPriceChange = useCallback((newPrice) => {
        onPriceChangeProp(newPrice)
    }, [onPriceChangeProp])

    const onCurrencyChange = useCallback(() => {
        if (disabled) { return }
        onCurrencyChangeProp(getQuoteCurrencyFor(currency))
    }, [onCurrencyChangeProp, currency, disabled])

    useEffect(() => {
        const quoteAmount = convert(price || '0', dataPerUsd, currency, getQuoteCurrencyFor(currency))
        setQuotePrice(quoteAmount)
    }, [price, dataPerUsd, currency])

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
                        onCommit={onPriceChange}
                        disabled={disabled}
                        placeholder="Price"
                        value={price.toString()}
                        error={error}
                        className={styles.input}
                    />
                    <SvgIcon name="transfer" className={styles.icon} onClick={onCurrencyChange} />
                    <PriceField
                        currency={getQuoteCurrencyFor(currency)}
                        placeholder="Price"
                        value={BN(quotePrice).isNaN() ? '0' : quotePrice.toString()}
                        disabled={disabled}
                        className={styles.input}
                    />
                    <span className={styles.per}>per</span>
                    <Dropdown
                        title=""
                        selectedItem={timeUnit}
                        onChange={onTimeUnitChange}
                        disabled={disabled}
                    >
                        {[timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => (
                            <Dropdown.Item key={unit} value={unit}>
                                {unit}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
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
