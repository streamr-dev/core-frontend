// @flow

import React, { Component } from 'react'
import Toolbar from '../Toolbar'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import StreamListing from './StreamListing'
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
    product: ?Product,
    showRelated?: boolean,
    toggleProductPublishState?: () => void,
    isUserOwner?: boolean,
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

const rightToolbar = (product, toggleProductPublishState) => {
    let productState = product ? product.state : 'Unknown'

    if (productState === 'new') {
        productState = 'Published'
        // TODO product state -> readable names
    }

    return (
        <div>
            <Button color="primary" onClick={() => (!!toggleProductPublishState && toggleProductPublishState())}>{productState}</Button>
        </div>
    )
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingStreams: false,
        showRelated: true,
    }

    render() {
        const {
            product,
            streams,
            fetchingStreams,
            showRelated,
            toggleProductPublishState,
            isUserOwner,
        } = this.props
        const leftToolbarButtons = leftToolbar(product)
        const rightToolbarButtons = rightToolbar(product, toggleProductPublishState)

        return !!product && (
            <div className={styles.productPage}>
                {isUserOwner && (
                    <Toolbar leftContent={leftToolbarButtons} rightContent={rightToolbarButtons} />
                )}
                <Hero
                    product={product}
                    leftContent={<Holder width="100p" height={400} text="Preview" />}
                    rightContent={<ProductDetails product={product} />}
                />
                <StreamListing streams={streams} fetchingStreams={fetchingStreams} />
                {showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
