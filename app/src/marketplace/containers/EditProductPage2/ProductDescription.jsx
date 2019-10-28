// @flow

import React, { useContext } from 'react'
import cx from 'classnames'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import usePending from '$shared/hooks/usePending'

import styles from './productDescription.pcss'

const ProductDescription = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')

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
                    error={isTouched('description') && !isValid ? message : undefined}
                    disabled={!!isPending}
                />
            </div>
        </section>
    )
}

export default ProductDescription
