// @flow

import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import { isCommunityProduct } from '$mp/utils/product'

import useProductActions from '../ProductController/useProductActions'
import { currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
import Toggle from '$shared/components/Toggle'
import BeneficiaryAddress from './BeneficiaryAddress'
import styles from './PriceSelector.pcss'

const PriceSelector = () => {
    const product = useProduct()
    const {
        updateIsFree,
        updatePrice,
        updatePriceCurrency,
        updateTimeUnit,
        updateBeneficiaryAddress,
    } = useProductActions()
    const dataPerUsd = useSelector(selectDataPerUsd)

    const [currency, setCurrency] = useState(product.priceCurrency || DEFAULT_CURRENCY)

    const onPriceTypeChange = useCallback((type) => {
        updateIsFree(type === 'Free')
    }, [updateIsFree])

    const onPriceChange = useCallback((p) => {
        updatePrice(p)
    }, [updatePrice])
    const onTimeUnitChange = useCallback((t) => {
        updateTimeUnit(t)
    }, [updateTimeUnit])

    const fixInFiat = product.priceCurrency === currencies.USD
    const onFixPriceChange = useCallback((checked) => {
        updatePriceCurrency(checked ? currencies.USD : currencies.DATA)
    }, [updatePriceCurrency])

    const isFreeProduct = !!product.isFree

    const { isValid, level, message } = useValidation('price')

    return (
        <section id="price" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.setPrice.title"
                />
                <RadioButtonGroup
                    name="productPriceType"
                    options={['Paid', 'Free']}
                    selectedOption={isFreeProduct ? 'Free' : 'Paid'}
                    onChange={onPriceTypeChange}
                />
                <div className={cx(styles.inner, {
                    [styles.disabled]: isFreeProduct,
                })}
                >
                    <SetPrice
                        className={styles.priceSelector}
                        disabled={!!product.isFree}
                        price={product.price}
                        onPriceChange={onPriceChange}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        timeUnit={product.timeUnit}
                        onTimeUnitChange={onTimeUnitChange}
                        dataPerUsd={dataPerUsd}
                    />
                    {!isValid && (
                        <p>{level}: {message}</p>
                    )}
                    {!isCommunityProduct(product) && (
                        <BeneficiaryAddress
                            className={styles.beneficiaryAddress}
                            address={product.beneficiaryAddress}
                            onChange={updateBeneficiaryAddress}
                            disabled={isFreeProduct}
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
                            disabled={isFreeProduct}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
