// @flow

import React from 'react'

import ProductCard from '../ProductCard'
import type {Product} from '../../flowtype/product-types'
import type {ErrorInUi} from '../../flowtype/common-types'

import styles from './products.pcss'

export type ProductProps = {
    products: Array<Product>,
    error: ?ErrorInUi
}

export const ProductList = (props: ProductProps) => (
    <div className={styles.products}>
        Products
        {props.error && (
            <div style={{
                background: 'red'
            }}>
                {props.error.message}
            </div>
        )}
        {props.products && props.products.map(p => (
            <ProductCard key={p.id} {...p} />
        ))}
    </div>
)

export default ProductList
