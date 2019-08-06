// @flow

import React from 'react'
import cx from 'classnames'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('name')
    const { updateName } = useProductActions()

    return (
        <div className={cx(styles.root, styles.ProductName)}>
            <h1>Name your product</h1>
            <input
                type="text"
                value={product.name}
                onChange={(e: SyntheticInputEvent<EventTarget>) => updateName(e.target.value)}
                placeholder="Product Name"
                className={styles.input}
            />
            {!isValid && (
                <p>{level}: {message}</p>
            )}
        </div>
    )
}

export default ProductName
