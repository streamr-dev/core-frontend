// @flow

import React, { useState, useCallback, useContext } from 'react'
import cx from 'classnames'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import Toggle from '$shared/components/Toggle'
import { isDataUnionProduct } from '$mp/utils/product'
import { productTypes } from '$mp/utils/constants'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

import styles from './productEditorDebug.pcss'

const ProductEditorDebug = () => {
    const [minimized, setMinimized] = useState(true)

    const toggle = useCallback(() => {
        setMinimized((prev) => !prev)
    }, [setMinimized])

    const product = useEditableProduct()
    const { updateType } = useEditableProductActions()
    const { touched, pendingChanges } = useContext(ValidationContext)

    const isDataUnion = isDataUnionProduct(product)
    const onFixPriceChange = useCallback((checked) => {
        updateType(checked ? productTypes.DATA_UNION : productTypes.NORMAL)
    }, [updateType])

    return (
        <div className={styles.root}>
            <button
                type="button"
                className={styles.title}
                onClick={toggle}
            >
                DEBUG
            </button>
            <div className={cx(styles.content, {
                [styles.minimized]: minimized,
            })}
            >
                Is Data Union? <Toggle
                    value={isDataUnion}
                    onChange={onFixPriceChange}
                />
                product:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(product, null, 2)}
                </pre>
                touched:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(touched, null, 2)}
                </pre>
                pending:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(pendingChanges, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default ProductEditorDebug
