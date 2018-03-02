// @flow

import React, { Component } from 'react'
import Search from '../Search'
import ProductTile from '../ProductTile'
import ProductList from '../ProductList'
import styles from './products.pcss'
import Error from '../Error'

import type {Product} from '../../flowtype/product-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type Props = {
    products: Array<Product>,
    error: ?ErrorInUi
}

export default class Products extends Component<Props> {
    render() {
        const { error, products } = this.props

        return (
            <div className={styles.products}>
                <Search />
                <Error source={error} />
                <div className={styles.productList}>
                    {products.length !== 0 && (
                        <ProductList>
                            {products.map(product => <ProductTile key={product.id} source={product} />)}
                        </ProductList>
                    )}
                </div>
            </div>
        )
    }
}
