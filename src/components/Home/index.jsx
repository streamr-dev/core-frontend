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
                        <Product name="Dolor ipsum sir" />
                        <Product name="Emat dolor ipsum" />
                        <Product name="Lorem emat ipsum" />
                        <Product name="Ipsum ipsum sir" />
                        <Product name="Dolor ipsum sir" />
                    </ProductList>
                </div>
            </div>
        )
    }
}
