// @flow

import React, { Component, type Node } from 'react'
import Toolbar from '../Toolbar'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import StreamListing from './StreamListing'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { ButtonActions } from '../Buttons'
import styles from './productPage.pcss'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    product: ?Product,
    showRelated?: boolean,
    showToolbar?: boolean,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
    showStreamActions?: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingStreams: false,
        showRelated: true,
        showToolbar: false,
    }

    render() {
        const {
            product,
            streams,
            fetchingStreams,
            showRelated,
            showToolbar,
            toolbarStatus,
            toolbarActions,
            showStreamActions,
            isLoggedIn,
            isProductSubscriptionValid,
        } = this.props
        const isProductFree = (product && product.pricePerSecond === 0) || false

        return !!product && (
            <div className={styles.productPage}>
                {showToolbar && (
                    <Toolbar status={toolbarStatus} actions={toolbarActions} />
                )}
                <Hero
                    product={product}
                    leftContent={<Holder width="100p" height={400} text="Preview" />}
                    rightContent={<ProductDetails product={product} />}
                />
                <StreamListing
                    streams={streams}
                    fetchingStreams={fetchingStreams}
                    showStreamActions={showStreamActions}
                    isLoggedIn={isLoggedIn}
                    isProductSubscriptionValid={isProductSubscriptionValid}
                    isProductFree={isProductFree}
                />
                {showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
