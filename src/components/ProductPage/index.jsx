// @flow

import React, { Component } from 'react'
import Toolbar from '../Toolbar'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import StreamListing from './StreamListing'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'
import { Link } from 'react-router-dom'
import { formatPath } from '../../utils/url'
import links from '../../links'
import { Button } from '@streamr/streamr-layout'

import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import styles from './productPage.pcss'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    fetchingProduct: boolean,
    product: ?Product,
    showRelated?: boolean,
}

const leftToolbar = (product) => (
    !!product && (
        <div>
            <Link to={formatPath(links.products, product.id || '', 'edit')}>
                <Button color="secondary">Edit</Button>
            </Link>
        </div>
    )
)

const rightToolbar = (publishedState) => {
    const publishDescription = publishedState ? 'Unpublish' : 'Publish'

    return (
        <div>
            <Button color="primary">{publishDescription}</Button>
        </div>
    )
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
        const publishedState = true // until props ready
        const leftToolbarButtons = leftToolbar(this.props.product)
        const rightToolbarButtons = rightToolbar(publishedState)

        return !!product && (
            <div className={styles.productPage}>
                {isOwner && (
                    <Toolbar leftContent={leftToolbarButtons} rightContent={rightToolbarButtons} />
                )}
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
