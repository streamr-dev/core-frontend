// @flow

import React, { useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import docsLinks from '$shared/../docsLinks'
import { isDataUnionProduct } from '$mp/utils/product'
import { usePending } from '$shared/hooks/usePending'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import SetPrice from '$mp/components/SetPrice'
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
    const { publishAttempted } = useContext(EditControllerContext)
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
                        pricingTokenAddress={product.pricingTokenAddress}
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
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
