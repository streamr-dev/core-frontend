// @flow

import React, { useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import docsLinks from '$shared/../docsLinks'
import { isDataUnionProduct } from '$mp/utils/product'
import { usePending } from '$shared/hooks/usePending'
import { contractCurrencies as currencies } from '$shared/utils/constants'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
import Toggle from '$shared/components/Toggle'
import SvgIcon from '$shared/components/SvgIcon'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import useEditableState from '$shared/contexts/Undo/useEditableState'

import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { isPublished } from './state'
import { Context as EditControllerContext } from './EditControllerProvider'

import BeneficiaryAddress from './BeneficiaryAddress'

import styles from './PriceSelector.pcss'

type Props = {
    disabled?: boolean,
}

const PriceSelector = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { publishAttempted, preferredCurrency: currency, setPreferredCurrency: setCurrency } = useContext(EditControllerContext)
    const { updateIsFree, updatePrice, updateBeneficiaryAddress } = useEditableProductActions()
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isPublic = isPublished(product)
    const contractProduct = useSelector(selectContractProduct)
    const isDisabled = !!(disabled || contractProductLoadPending)
    const isPriceTypeDisabled = !!(isDisabled || isPublic || !!contractProduct)

    const onPriceTypeChange = useCallback((type) => {
        updateIsFree(type === 'Free')
    }, [updateIsFree])

    const onPriceChange = useCallback((p) => {
        const price = p
        updatePrice(price, product.priceCurrency, product.timeUnit)
    }, [updatePrice, product.priceCurrency, product.timeUnit])

    const onTimeUnitChange = useCallback((t) => {
        updatePrice(product.price, product.priceCurrency, t)
    }, [updatePrice, product.price, product.priceCurrency])

    const fixInFiat = product.priceCurrency === currencies.USD

    const onFixPriceChange = useCallback((checked) => {
        const newCurrency = checked ? currencies.USD : currencies.DATA
        const newPrice = product.price
        updatePrice(newPrice, newCurrency, product.timeUnit)
    }, [updatePrice, product.price, product.timeUnit])

    const isFreeProduct = !!product.isFree
    const isDataUnion = isDataUnionProduct(product)

    const { isValid, message } = useValidation('pricePerSecond')

    return (
        <section id="price" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <h1>Set a price</h1>
                <p>
                    Set the price for your product here. Note that once published,
                    you will not be able to make a free product into a paid one or vice versa.
                    But you can edit this while your product is a draft. For help,
                    see the <Link to={docsLinks.creatingDataProducts}>docs</Link>.
                </p>
                <RadioButtonGroup
                    name="productPriceType"
                    options={['Paid', 'Free']}
                    selectedOption={isFreeProduct ? 'Free' : 'Paid'}
                    onChange={onPriceTypeChange}
                    disabled={isPriceTypeDisabled}
                    className={styles.radioGroup}
                />
                <div className={cx(styles.inner, {
                    [styles.disabled]: isFreeProduct || isDisabled,
                })}
                >
                    <SetPrice
                        className={styles.priceSelector}
                        disabled={isFreeProduct || isDisabled}
                        price={product.price}
                        onPriceChange={onPriceChange}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        timeUnit={product.timeUnit}
                        onTimeUnitChange={onTimeUnitChange}
                        error={publishAttempted && !isValid ? message : undefined}
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
                                disabled={isFreeProduct || isDisabled}
                            />
                        )}
                        <div className={styles.fixPrice}>
                            <label htmlFor="fixPrice">
                                <span>
                                    Fix price in fiat
                                    {!!isDataUnion && ' for protection against shifts in the DATA price'}
                                </span>
                                <div className={styles.tooltipContainer}>
                                    <SvgIcon name="outlineQuestionMark" className={styles.helpIcon} />
                                    <div className={styles.tooltip}>
                                        Fixing the price in fiat can give you protection against shifts in the DATA price
                                    </div>
                                </div>
                            </label>
                            <Toggle
                                id="fixPrice"
                                className={styles.toggle}
                                value={fixInFiat}
                                onChange={onFixPriceChange}
                                disabled={isFreeProduct || isDisabled}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
