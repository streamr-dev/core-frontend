// @flow

import React, { Component } from 'react'
import ProductTile from '../ProductTile'
import ProductListComponent from '../ProductList'
import styles from './products.pcss'
import Error from '../Error'

import type { ProductList } from '../../flowtype/product-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type Props = {
    products: ProductList,
    error: ?ErrorInUi
}

export default class Products extends Component<Props> {
    render() {
        const { error, products } = this.props

        return (
            <div className={styles.products}>
                <Error source={error} />
                <div className={styles.productList}>
                    {products.length !== 0 && (
                        <ProductListComponent>
                            {products.map(product => <ProductTile key={product.id} source={product} />)}
                        </ProductListComponent>
                    )}
                </div>
            </div>
        )
    }
}
