// @flow

import React, { Component } from 'react'
import Search from '../Search'
import Product from '../Product'
import ProductList from '../ProductList'

import styles from './home.pcss'

export default class Home extends Component<{}> {
    render() {
        return (
            <div className={styles.home}>
                <Search />
                <div className={styles.productList}>
                    <ProductList>
                        <Product id="product1" name="Dolor ipsum sir" />
                        <Product id="product2" name="Emat dolor ipsum" />
                        <Product id="product3" name="Lorem emat ipsum" />
                        <Product id="product4" name="Ipsum ipsum sir" />
                        <Product id="product5" name="Dolor ipsum sir" />
                    </ProductList>
                </div>
            </div>
        )
    }
}
