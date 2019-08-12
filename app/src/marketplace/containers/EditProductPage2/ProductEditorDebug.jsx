// @flow

import React, { useCallback, useContext } from 'react'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import Toggle from '$shared/components/Toggle'

import useProduct from '../ProductController/useProduct'
import useProductActions from '../ProductController/useProductActions'

import styles from './productEditorDebug.pcss'

const ProductEditorDebug = () => {
    const product = useProduct()
    const { updateType } = useProductActions()
    const { touched } = useContext(ValidationContext)

    const isCommunity = product.type === 'COMMUNITY'
    const onFixPriceChange = useCallback((checked) => {
        updateType(checked ? 'COMMUNITY' : 'NORMAL')
    }, [updateType])

    return (
        <div className={styles.root}>
            Is Community Product? <Toggle
                value={isCommunity}
                onChange={onFixPriceChange}
            />
            <pre className={styles.productData}>
                {JSON.stringify(product, null, 2)}
            </pre>
            <pre className={styles.productData}>
                {JSON.stringify(touched, null, 2)}
            </pre>
        </div>
    )
}

export default ProductEditorDebug
