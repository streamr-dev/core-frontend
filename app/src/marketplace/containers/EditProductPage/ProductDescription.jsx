// @flow

import React, { useContext, useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import usePending from '$shared/hooks/usePending'
import routes from '$routes'

import styles from './productDescription.pcss'

const ProductDescription = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')

    const [description, setDescription] = useState(product.description || '')

    useEffect(() => {
        setDescription(product.description || '')
    }, [product.description])

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
                    value={description}
                    onChange={setDescription}
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
