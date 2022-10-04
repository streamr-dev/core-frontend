// @flow

import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { usePending } from '$shared/hooks/usePending'
import RadioButtonGroup from '$shared/components/RadioButtonGroup'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import useEditableState from '$shared/contexts/Undo/useEditableState'

import useEditableProductActions from '../ProductController/useEditableProductActions'
import { isPublished } from './state'

import styles from './PriceSelector.pcss'

type Props = {
    disabled?: boolean,
}

const ProductType = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateIsFree } = useEditableProductActions()
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isPublic = isPublished(product)
    const contractProduct = useSelector(selectContractProduct)
    const isDisabled = !!(disabled || contractProductLoadPending)
    const isPriceTypeDisabled = !!(isDisabled || isPublic || !!contractProduct)
    const { pricingTokenDecimals } = product

    const onPriceTypeChange = useCallback((type) => {
        updateIsFree(type === 'Free', pricingTokenDecimals)
    }, [updateIsFree, pricingTokenDecimals])

    const isFreeProduct = !!product.isFree

    return (
        <section id="type" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <h1>Product type</h1>
                <p>
                    Data in paid products can only be accessed after payment, while free products contain public data.
                    Note that you can not change this setting after the product is published.
                </p>
                <RadioButtonGroup
                    name="productPriceType"
                    options={['Paid', 'Free']}
                    selectedOption={isFreeProduct ? 'Free' : 'Paid'}
                    onChange={onPriceTypeChange}
                    disabled={isPriceTypeDisabled}
                    className={styles.radioGroup}
                />
            </div>
        </section>
    )
}

export default ProductType
