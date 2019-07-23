// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductUpdater from '../ProductController/useProductUpdater'

const ProductName = () => {
    const product = useProduct()
    const { updateProduct } = useProductUpdater()
    const { status } = useValidation('name')

    const onChange = (name) => {
        updateProduct('name', (p) => ({
            ...p,
            name,
        }))
    }

    return (
        <div>
            <h1>Name your product</h1>
            <p>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
                />
                <br />
                status: {status}
            </p>
        </div>
    )
}

export default ProductName
