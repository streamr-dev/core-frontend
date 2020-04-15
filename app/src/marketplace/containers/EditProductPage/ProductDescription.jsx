// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import { Context as EditControllerContext } from './EditControllerProvider'
import usePending from '$shared/hooks/usePending'
import routes from '$routes'

import styles from './productDescription.pcss'

const ProductDescription = () => {
    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')

    return (
        <section id="description" className={cx(styles.root, styles.ProductDescription)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.productDescription.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.productDescription.description"
                    docsLink={routes.docsProductsIntroToProducts()}
                    dangerousHTML
                />
                <MarkdownEditor
                    placeholder="Type something great about your product"
                    value={product.description || ''}
                    onChange={updateDescription}
                    className={styles.productDescription}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!isPending}
                />
            </div>
        </section>
    )
}

export default ProductDescription
