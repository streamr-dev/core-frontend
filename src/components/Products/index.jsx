// @flow

import React, { Component } from 'react'
import Search from '../Search'
import ProductTile from '../ProductTile'
import ProductList from '../ProductList'
import styles from './products.pcss'
import Error from '../Error'

import type {Product} from '../../flowtype/product-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type StateProps = {
    products: Array<Product>,
    error: ?ErrorInUi
}

export type DispatchProps = {
    getProducts: () => void
}

type Props = StateProps & DispatchProps

export default class Products extends Component<Props> {
    componentDidMount() {
        this.props.getProducts()
    }

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
