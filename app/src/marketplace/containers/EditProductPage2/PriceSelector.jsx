// @flow

import React, { useState, useCallback, useEffect, useRef } from 'react'
import BN from 'bignumber.js'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import ScrollableAnchor from 'react-scrollable-anchor'

import useProduct from '../ProductController/useProduct'

import { type Ref } from '$shared/flowtype/common-types'
import { isPaidProduct } from '$mp/utils/product'
import useProductActions from '../ProductController/useProductActions'
import { timeUnits, currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit, convert } from '$mp/utils/price'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
import Toggle from '$shared/components/Toggle'
import BeneficiaryAddress from './BeneficiaryAddress'
import styles from './PriceSelector.pcss'

const getPricePerSecond = (isPaid, price, currency, timeUnit, dataPerUsd) => {
    let pricePerSecond
    if (!isPaid) {
        pricePerSecond = BN(0)
    } else {
        const newPrice = (currency !== currencies.DATA) ?
            convert(price || '0', dataPerUsd, currency, currencies.DATA) : price
        pricePerSecond = pricePerSecondFromTimeUnit(newPrice || BN(0), timeUnit)
    }

    return pricePerSecond
}

const PriceSelector = () => {
    const product = useProduct()
    const { updatePricePerSecond, updatePriceCurrency, updateBeneficiaryAddress } = useProductActions()
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
        const { current: updatePrice } = updateRef
        if (updatePrice) {
            updatePrice(getPricePerSecond(isPaid, price, currency, timeUnit, dataPerUsd))
        }
    }, [isPaid, price, currency, timeUnit, dataPerUsd])

    const fixInFiat = product.priceCurrency === currencies.USD
    const onFixPriceChange = useCallback((checked) => {
        updatePriceCurrency(checked ? currencies.USD : currencies.DATA)
    }, [updatePriceCurrency])

    return (
        <ScrollableAnchor id="price">
            <div className={cx(styles.root, styles.PriceSelector)}>
                <Translate
                    tag="h1"
                    value="editProductPage.setPrice.title"
                />
                <RadioButtonGroup
                    name="productPriceType"
                    options={['Paid', 'Free']}
                    selectedOption={!isPaid ? 'Free' : 'Paid'}
                    onChange={onPriceTypeChange}
                />
                <div className={cx(styles.inner, {
                    [styles.disabled]: !isPaid,
                })}
                >
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
                    {product.type !== 'COMMUNITY' && (
                        <BeneficiaryAddress
                            className={styles.beneficiaryAddress}
                            address={product.beneficiaryAddress}
                            onChange={updateBeneficiaryAddress}
                            disabled={!isPaid}
                        />
                    )}
                    <div className={styles.fixPrice}>
                        <label htmlFor="fixPrice">
                            <Translate value="editProductPage.setPrice.fixPrice" />
                        </label>
                        <Toggle
                            id="fixPrice"
                            className={styles.toggle}
                            value={fixInFiat}
                            onChange={onFixPriceChange}
                            disabled={!isPaid}
                        />
                    </div>
                </div>
            </div>
        </ScrollableAnchor>
    )
}

export default PriceSelector
