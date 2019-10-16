// @flow

import React from 'react'
import cx from 'classnames'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'
import MarkdownEditor from '$mp/components/MarkdownEditor'

import styles from './productDescription.pcss'

const ProductDescription = () => {
    const product = useProduct()
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useProductActions()

    return (
        <section id="description" className={cx(styles.root, styles.ProductDescription)}>
            <div>
                <h1>Write a product description</h1>
                <p>Sell your product — make sure you include details about the contents of
                    your streams, historical data, and any other relevant details.
                    Generally around a maximum of around 300 words fits best on a product
                    detail page. Markdown formatting is ok.
                </p>
                <MarkdownEditor
                    placeholder="Type something great about your product"
                    value={product.description || ''}
                    onCommit={updateDescription}
                    className={styles.productDescription}
                    error={!isValid ? message : undefined}
                />
            </div>
        </section>
    )
}

export default ProductDescription
