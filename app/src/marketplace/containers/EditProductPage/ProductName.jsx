// @flow

import React, { useContext, useCallback } from 'react'
import cx from 'classnames'

import Text, { SpaciousTheme } from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'

import styles from './productName.pcss'

type Props = {
    disabled?: boolean,
}

const ProductName = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { isValid, message } = useValidation('name')
    const { updateName } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const invalid = publishAttempted && !isValid

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        updateName(e.target.value)
    }, [updateName])

    return (
        <section id="product-name" className={cx(styles.root, styles.ProductName)}>
            <div>
                <h1>Name your product</h1>
                <Text
                    defaultValue={product.name}
                    onChange={onChange}
                    placeholder="Product Name"
                    disabled={!!disabled}
                    selectAllOnFocus
                    invalid={invalid}
                    className={styles.input}
                    theme={SpaciousTheme}
                    name="name"
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
