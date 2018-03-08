// @flow

import React, { Component } from 'react'
import Hero from './Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import styles from './productPage.pcss'

export type Props = {
    product: ?Product,
    streams?: ?StreamList,
}

export default class ProductPage extends Component<Props> {
    render() {
        const { product, streams } = this.props
        console.log(streams)
        return !!product && (
            <div className={styles.productPage}>
                <Hero product={product} />
                {streams && (
                    <Details streams={streams} />
                )}
                <Preview />
                <RelatedProducts />
            </div>
        )
    }
}
