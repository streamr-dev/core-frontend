// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import usePending from '$shared/hooks/usePending'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'

import TextField from '$mp/components/TextField'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('name')
    const { updateName } = useEditableProductActions()
    const { isTouched } = useContext(ValidationContext)
    const { isPending } = usePending('product.SAVE')

    return (
        <section id="product-name" className={cx(styles.root, styles.ProductName)}>
            <div>
                <h1>Name your product</h1>
                <TextField
                    value={product.name}
                    onCommit={updateName}
                    placeholder="Product Name"
                    error={isTouched('name') && !isValid ? message : undefined}
                    disabled={isPending}
                    className={styles.input}
                />
            </div>
        </section>
    )
}

export default ProductName
