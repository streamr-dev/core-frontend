// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'

const ProductName = () => {
    const product = useProduct()

    return (
        <div>
            <h1>Name your product</h1>
            <p>{product.name}</p>
        </div>
    )
}

export default ProductName
