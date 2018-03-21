// @flow

import React, { Component } from 'react'
import ActionPanel from './ActionPanel'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { Props as DetailProps } from './Details'
import styles from './productPage.pcss'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
    }

    render() {
        const { product, streams, fetchingStreams } = this.props
        const isOwner = true //until props are ready..

        return !!product && (
            <div className={styles.productPage}>
                {isOwner && <ActionPanel />}
                {!isOwner && <ActionPanel />}
                <Hero
                    product={product}
                    leftContent={<Holder width="100p" height={400} text="Preview" />}
                    rightContent={<ProductDetails product={product} />}
                />
                <Details streams={streams} fetchingStreams={fetchingStreams} />
                <Preview />
                <RelatedProducts />
            </div>
        )
    }
}
