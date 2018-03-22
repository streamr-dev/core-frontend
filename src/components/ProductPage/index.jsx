// @flow

import React, { Component } from 'react'
import ActionPanel from './ActionPanel'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import StreamListing from './StreamListing'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { Props as DetailProps } from './StreamListing'
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
        const isOwner = true //until props are ready..

        return !!product && (
            <div className={styles.productPage}>
                {isOwner && <ActionPanel productId={product.id} published={true}/>}
                {!isOwner && <ActionPanel productId={product.id} published={true}/>}
                <Hero
                    product={product}
                    leftContent={<Holder width="100p" height={400} text="Preview" />}
                    rightContent={<ProductDetails product={product} />}
                />
                <StreamListing streams={streams} fetchingStreams={fetchingStreams} />
                <Preview />
                {showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
