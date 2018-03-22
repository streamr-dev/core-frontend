// @flow

import React, { Component } from 'react'
import Hero from './Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { Props as DetailProps } from './Details'
import styles from './productPage.pcss'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    showRelated?: boolean,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
        showRelated: true,
    }

    render() {
        const { product, streams, fetchingStreams, showRelated } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Hero product={product} />
                <Details streams={streams} fetchingStreams={fetchingStreams} />
                <Preview />
                {showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
