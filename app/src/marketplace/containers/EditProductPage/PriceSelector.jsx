// @flow

import React, { useState, useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import { isDataUnionProduct } from '$mp/utils/product'
import { usePending } from '$shared/hooks/usePending'
import { contractCurrencies as currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
import Toggle from '$shared/components/Toggle'
import SvgIcon from '$shared/components/SvgIcon'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { isPublished } from './state'
import routes from '$routes'

import BeneficiaryAddress from './BeneficiaryAddress'

import styles from './PriceSelector.pcss'

const PriceSelector = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)

    const {
        updateIsFree,
        updatePrice,
        updatePriceCurrency,
        updateTimeUnit,
        updateBeneficiaryAddress,
    } = useEditableProductActions()
    const dataPerUsd = useSelector(selectDataPerUsd)
    const { isPending: savePending } = usePending('product.SAVE')
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isPublic = isPublished(product)
    const contractProduct = useSelector(selectContractProduct)
    const isLoadingOrSaving = !!(savePending || contractProductLoadPending)
    const isPriceTypeDisabled = !!(isLoadingOrSaving || isPublic || !!contractProduct)

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
    const isDataUnion = isDataUnionProduct(product)

    const { isValid, message } = useValidation('pricePerSecond')

    return (
        <section id="price" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.setPrice.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.setPrice.description"
                    docsLink={routes.docsProductsIntroToProducts()}
                    dangerousHTML
                />
                <RadioButtonGroup
                    name="productPriceType"
                    options={['Paid', 'Free']}
                    selectedOption={isFreeProduct ? 'Free' : 'Paid'}
                    onChange={onPriceTypeChange}
                    disabled={isPriceTypeDisabled}
                    className={styles.radioGroup}
                />
                <div className={cx(styles.inner, {
                    [styles.disabled]: isFreeProduct || isLoadingOrSaving,
                })}
                >
                    <SetPrice
                        className={styles.priceSelector}
                        disabled={isFreeProduct || isLoadingOrSaving}
                        price={product.price}
                        onPriceChange={onPriceChange}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        timeUnit={product.timeUnit}
                        onTimeUnitChange={onTimeUnitChange}
                        dataPerUsd={dataPerUsd}
                        error={isTouched('pricePerSecond') && !isValid ? message : undefined}
                    />
                    <div
                        className={cx({
                            [styles.priceOptions]: !!isDataUnion,
                            [styles.priceOptionsWithAddress]: !isDataUnion,
                        })}
                    >
                        {!isDataUnion && (
                            <BeneficiaryAddress
                                address={product.beneficiaryAddress}
                                onChange={updateBeneficiaryAddress}
                                disabled={isFreeProduct || isLoadingOrSaving}
                            />
                        )}
                        <div className={styles.fixPrice}>
                            <label htmlFor="fixPrice">
                                <Translate value={`editProductPage.setPrice.${isDataUnion ? 'dataUnion' : 'dataProduct'}.fixPrice`} />
                                <SvgIcon name="outlineQuestionMark" className={styles.helpIcon} />
                            </label>
                            <Toggle
                                id="fixPrice"
                                className={styles.toggle}
                                value={fixInFiat}
                                onChange={onFixPriceChange}
                                disabled={isFreeProduct || isLoadingOrSaving}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
