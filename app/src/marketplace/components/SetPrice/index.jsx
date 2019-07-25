// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'

import type { NumberString, TimeUnit, Currency } from '$shared/flowtype/common-types'
import { timeUnits, currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { convert } from '$mp/utils/price'

import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import Toggle from '$shared/components/Toggle'
import Dropdown from '$shared/components/Dropdown'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './setPrice.pcss'

type Props = {
    dataPerUsd: NumberString,
    onChange: (isFree: boolean, amount: NumberString, currency: string, timeUnit: TimeUnit, fixInFiat: boolean) => void,
    className?: string,
}

const getQuoteCurrencyFor = (currency: Currency) => (
    currency === currencies.DATA ? currencies.USD : currencies.DATA
)

const SetPrice = ({ dataPerUsd, onChange, className }: Props) => {
    const [timeUnit, setTimeUnit] = useState(timeUnits.hour)
    const [priceCurrency, setPriceCurrency] = useState(DEFAULT_CURRENCY)
    const [basePrice, setBasePrice] = useState(BN(0))
    const [quotePrice, setQuotePrice] = useState(BN(0))
    const [isFreeProduct, setIsFreeProduct] = useState(false)
    const [fixInFiat, setFixInFiat] = useState(false)

    const onBasePriceChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const newPrice = e.target.value
        setBasePrice(newPrice)
    }, [])

    const onCurrencyChange = useCallback(() => {
        setPriceCurrency(getQuoteCurrencyFor(priceCurrency))
    }, [priceCurrency])

    const onTimeUnitChange = useCallback((unit) => {
        setTimeUnit(unit)
    }, [setTimeUnit])

    const onPriceTypeChange = useCallback((type) => {
        setIsFreeProduct(type === 'Free')
    }, [setIsFreeProduct])

    const onFixPriceChange = useCallback((value) => {
        setFixInFiat(value)
    }, [setFixInFiat])

    useEffect(() => {
        const quoteAmount = convert(basePrice || '0', dataPerUsd, priceCurrency, getQuoteCurrencyFor(priceCurrency))
        setQuotePrice(quoteAmount)
    }, [basePrice, dataPerUsd, priceCurrency])

    useEffect(() => {
        if (onChange) {
            if (isFreeProduct) {
                onChange(isFreeProduct, 'N/A', 'N/A', 'N/A', false)
            } else {
                onChange(isFreeProduct, basePrice.toString(), priceCurrency, timeUnit, fixInFiat)
            }
        }
    }, [onChange, isFreeProduct, basePrice, timeUnit, priceCurrency, fixInFiat])

    return (
        <div className={cx(styles.root, className)}>
            <RadioButtonGroup
                name="productPriceType"
                options={['Paid', 'Free']}
                selectedOption={isFreeProduct ? 'Free' : 'Paid'}
                onChange={onPriceTypeChange}
            />
            <div
                className={cx({
                    [styles.hidden]: isFreeProduct,
                })}
            >
                <div className={styles.priceControls}>
                    <input className={styles.input} placeholder="Price" value={basePrice.toString()} onChange={onBasePriceChange} />
                    <span className={styles.currency}>{priceCurrency}</span>
                    <SvgIcon name="transfer" className={styles.icon} onClick={onCurrencyChange} />
                    <input className={styles.input} placeholder="Price" value={quotePrice.toString()} disabled />
                    <span className={styles.currency}>{getQuoteCurrencyFor(priceCurrency)}</span>
                    <span className={styles.per}>per</span>
                    <Dropdown title="" selectedItem={timeUnit} onChange={onTimeUnitChange}>
                        {[timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => (
                            <Dropdown.Item key={unit} value={unit}>
                                {unit}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>

                <div className={styles.fixPrice}>
                    <label htmlFor="fixPrice">Fix price in fiat for protection against shifts in the DATA price</label>
                    <Toggle id="fixPrice" className={styles.toggle} value={fixInFiat} onChange={onFixPriceChange} />
                </div>
            </div>
        </div>
    )
}

export default SetPrice
