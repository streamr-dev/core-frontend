// @flow

import React, { Component, type Node } from 'react'
import BN from 'bignumber.js'

import Toolbar from '../Toolbar'
import Hero from '../Hero'
import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { ButtonActions } from '../Buttons'
import { Logo } from '../ProductTile/Logo'

import ProductDetails from './ProductDetails'
import StreamListing from './StreamListing'
import RelatedProducts from './RelatedProducts'
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
    onPurchase?: () => void,
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
            onPurchase,
        } = this.props
        const isProductFree = (product && BN(product.pricePerSecond).isEqualTo(0)) || false

        return !!product && (
            <div className={styles.productPage}>
                {showToolbar && (
                    <Toolbar status={toolbarStatus} actions={toolbarActions} />
                )}
                <Hero
                    product={product}
                    leftContent={product.imageUrl
                        ? <img className={styles.productImage} alt={product.name} src={product.imageUrl} />
                        :
                        <div className={styles.defaultImagePlaceholder}>
                            <Logo color="black" opacity="0.15" />
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAA
                                     AA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
                                alt="Product"
                            />
                        </div>
                    }
                    rightContent={
                        <ProductDetails
                            product={product}
                            isValidSubscription={!!isProductSubscriptionValid}
                            onPurchase={() => onPurchase && onPurchase()}
                        />}
                />
                <StreamListing
                    product={product}
                    streams={streams}
                    fetchingStreams={fetchingStreams}
                    showStreamActions={showStreamActions}
                    isLoggedIn={isLoggedIn}
                    isProductSubscriptionValid={isProductSubscriptionValid}
                    isProductFree={isProductFree}
                />
                {false && showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
