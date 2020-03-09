// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import usePending from '$shared/hooks/usePending'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import Text, { SpaciousTheme } from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('name')
    const { updateName } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')
    const { publishAttempted } = useContext(EditControllerContext)
    const invalid = publishAttempted && !isValid

    return (
        <section id="product-name" className={cx(styles.root, styles.ProductName)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.productName.title"
                />
                <Text
                    defaultValue={product.name}
                    onCommit={updateName}
                    placeholder="Product Name"
                    disabled={isPending}
                    selectAllOnFocus
                    smartCommit
                    invalid={invalid}
                    className={styles.input}
                    theme={SpaciousTheme}
                />
                {invalid && (
                    <Errors theme={MarketplaceTheme}>
                        {message}
                    </Errors>
                )}
            </div>
        </section>
    )
}

export default ProductName
