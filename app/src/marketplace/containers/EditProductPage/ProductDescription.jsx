// @flow

import React, { useContext } from 'react'
import cx from 'classnames'

import MarkdownEditor from '$mp/components/MarkdownEditor'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './productDescription.pcss'

type Props = {
    disabled?: boolean,
}

const ProductDescription = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()

    return (
        <section id="description" className={cx(styles.root, styles.ProductDescription)}>
            <div>
                <h1>Write a product description</h1>
                <p>
                    Sell your product — make sure you include details about the contents of your streams,
                    historical data, and any other relevant details.
                    Generally around a maximum of around 300 words fits best on a product detail page. Markdown formatting is ok.
                </p>
                <MarkdownEditor
                    placeholder="Type something great about your product"
                    value={product.description || ''}
                    onChange={updateDescription}
                    className={styles.productDescription}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!disabled}
                />
            </div>
        </section>
    )
}

export default ProductDescription
