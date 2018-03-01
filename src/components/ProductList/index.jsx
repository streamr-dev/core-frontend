// @flow

import React from 'react'

import ProductCard from '../ProductCard'
import type {ProductList as ProductListType} from '../../flowtype/product-types'

export type ProductProps = {
    products: ProductListType,
}

export const ProductList = (props: ProductProps) => (
    <div>
        {props.products && props.products.map(p => (
            <ProductCard key={p.id} {...p} />
        ))}
    </div>
)

export default ProductList
