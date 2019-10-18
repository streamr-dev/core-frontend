// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import TextField from '$mp/components/TextField'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useProduct()
    const { isValid, message } = useValidation('name')
    const { updateName } = useProductActions()
    const { isTouched } = useContext(ValidationContext)

    return (
        <section id="product-name" className={cx(styles.root, styles.ProductName)}>
            <div>
                <h1>Name your product</h1>
                <TextField
                    value={product.name}
                    onCommit={updateName}
                    placeholder="Product Name"
                    error={isTouched('name') && !isValid ? message : undefined}
                />
            </div>
        </section>
    )
}

export default ProductName
