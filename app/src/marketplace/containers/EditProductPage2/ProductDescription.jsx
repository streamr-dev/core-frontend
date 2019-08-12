// @flow

import React from 'react'
import cx from 'classnames'
import ScrollableAnchor from 'react-scrollable-anchor'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'
import MarkdownEditor from '$mp/components/MarkdownEditor'

import styles from './productDescription.pcss'

const ProductDescription = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('description')
    const { updateDescription } = useProductActions()

    return (
        <ScrollableAnchor id="description">
            <div className={cx(styles.root, styles.ProductDescription)}>
                <h1>Write a product description</h1>
                <p>Sell your product — make sure you include details about the contents of
                    your streams, historical data, and any other relevant details.
                    Generally around a maximum of around 300 words fits best on a product
                    detail page. Markdown formatting is ok.
                </p>
                <MarkdownEditor
                    placeholder="Type something great about your product"
                    value={product.description}
                    onChange={updateDescription}
                    className={styles.productDescription}
                />
                {!isValid && (
                    <p>{level}: {message}</p>
                )}
            </div>
        </ScrollableAnchor>
    )
}

export default ProductDescription
