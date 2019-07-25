// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

const ProductName = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('name')
    const { updateName } = useProductActions()

    return (
        <div>
            <h1>Name your product</h1>
            <p>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => updateName(e.target.value)}
                />
            </p>
            {!isValid && (
                <p>{level}: {message}</p>
            )}
        </div>
    )
}

export default ProductName
