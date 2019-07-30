// @flow

import React, { useState, useCallback, useEffect, useRef } from 'react'
import BN from 'bignumber.js'
import { useSelector } from 'react-redux'

import useProduct from '../ProductController/useProduct'

import { type Ref } from '$shared/flowtype/common-types'
import { isPaidProduct } from '$mp/utils/product'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
import Toggle from '$shared/components/Toggle'
import useProductActions from '../ProductController/useProductActions'
import { timeUnits, currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit, convert } from '$mp/utils/price'
import { selectDataPerUsd } from '$mp/modules/global/selectors'

import styles from './PriceSelector.pcss'

const PriceSelector = () => {
    const product = useProduct()
    const { updatePricePerSecond, updatePriceCurrency } = useProductActions()
    const dataPerUsd = useSelector(selectDataPerUsd)

    const [isPaid, setIsPaid] = useState(isPaidProduct(product))
    const [timeUnit, setTimeUnit] = useState(timeUnits.hour)
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
    const [price, setPrice] = useState(priceForTimeUnits(product.pricePerSecond || '0', 1, timeUnits.hour).toString())

    const updateRef: Ref<Function> = useRef()
    updateRef.current = updatePricePerSecond

    const onPriceTypeChange = useCallback((type) => {
        setIsPaid(type !== 'Free')
    }, [setIsPaid])

    useEffect(() => {
        if (updateRef.current) {
            let pricePerSecond
            if (!isPaid) {
                pricePerSecond = BN(0)
            } else {
                const newPrice = (currency !== currencies.DATA) ?
                    convert(price || '0', dataPerUsd, currency, currencies.DATA) : price
                pricePerSecond = pricePerSecondFromTimeUnit(newPrice || BN(0), timeUnit)
            }
            updateRef.current(pricePerSecond)
        }
    }, [isPaid, price, currency, timeUnit, dataPerUsd])

    const fixInFiat = product.priceCurrency === currencies.USD
    const onFixPriceChange = useCallback((checked) => {
        updatePriceCurrency(checked ? currencies.USD : currencies.DATA)
    }, [updatePriceCurrency])

    return (
        <div>
            <h1>Set a price</h1>
            <RadioButtonGroup
                name="productPriceType"
                options={['Paid', 'Free']}
                selectedOption={!isPaid ? 'Free' : 'Paid'}
                onChange={onPriceTypeChange}
            />
            <SetPrice
                className={styles.priceSelector}
                disabled={!isPaid}
                price={price}
                onPriceChange={setPrice}
                currency={currency}
                onCurrencyChange={setCurrency}
                timeUnit={timeUnit}
                onTimeUnitChange={setTimeUnit}
                dataPerUsd={dataPerUsd}
            />
            <div className={styles.fixPrice}>
                <label htmlFor="fixPrice">Fix price in fiat for protection against shifts in the DATA price</label>
                <Toggle id="fixPrice" className={styles.toggle} value={fixInFiat} onChange={onFixPriceChange} />
            </div>
        </div>
    )
}

export default PriceSelector
