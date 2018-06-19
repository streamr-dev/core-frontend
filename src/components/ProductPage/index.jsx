// @flow

import React, { Component, type Node } from 'react'
import BN from 'bignumber.js'
import MediaQuery from 'react-responsive'
import { breakpoints } from '@streamr/streamr-layout'
import ReactImg from 'react-image'

import Toolbar from '../Toolbar'
import Hero from '../Hero'
import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { ButtonActions } from '../Buttons'
import { Logo } from '../ProductTile/Logo'
import Products from '../Products'

import ProductDetails from './ProductDetails'
import StreamListing from './StreamListing'
import styles from './productPage.pcss'

const { md } = breakpoints

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    product: ?Product,
    relatedProducts: Array<Product>,
    showToolbar?: boolean,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
    showStreamActions?: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
    onPurchase?: () => void,
}

const imageFallback = () => (
    <div className={styles.defaultImagePlaceholder}>
        <Logo color="black" opacity="0.15" />
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAA
                AA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
            alt="Product"
        />
    </div>
)

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
            relatedProducts,
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
                    leftContent={
                        <ReactImg
                            className={styles.productImage}
                            src={product.imageUrl}
                            alt={product.name}
                            unloader={imageFallback()}
                        />
                    }
                    rightContent={
                        <ProductDetails
                            product={product}
                            isValidSubscription={!!isProductSubscriptionValid}
                            onPurchase={() => onPurchase && onPurchase()}
                        />
                    }
                />
                <StreamListing
                    product={product}
                    streams={streams}
                    fetchingStreams={fetchingStreams}
                    showStreamActions={showStreamActions}
                    isLoggedIn={isLoggedIn}
                    isProductSubscriptionValid={isProductSubscriptionValid}
                    isProductFree={isProductFree}
                    className={styles.section}
                />
                {relatedProducts.length > 0 && (
                    <MediaQuery minDeviceWidth={md.max} className={styles.section}>
                        {(matches) => ((matches)
                            ? <Products
                                header="Related products"
                                products={relatedProducts}
                                type="relatedProducts"
                            />
                            : <Products
                                header="Related products"
                                products={relatedProducts.slice(0, 2)}
                                type="relatedProducts"
                            />
                        )}
                    </MediaQuery>
                )}
            </div>
        )
    }
}
