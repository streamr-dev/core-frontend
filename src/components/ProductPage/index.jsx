// @flow

import React, { Component } from 'react'
import Hero from './Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import styles from './productPage.pcss'

export type Props = {
    product: ?Product,
}

export default class ProductPage extends Component<Props> {
    render() {
        const { product } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Hero product={product} />
                <Details />
                <Preview />
                <RelatedProducts />
            </div>
        )
    }
}
