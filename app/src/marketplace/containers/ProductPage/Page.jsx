// @flow

import React, { Component, type Node } from 'react'
import BN from 'bignumber.js'
import MediaQuery from 'react-responsive'
import breakpoints from '$app/scripts/breakpoints'
import classNames from 'classnames'
import { I18n } from 'react-redux-i18n'

import Toolbar from '$shared/components/Toolbar'
import Hero from '$mp/components/Hero'
import type { Product, Subscription } from '../../flowtype/product-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import type { ButtonActions } from '$shared/components/Buttons'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import Products from '$mp/components/Products'
import FallbackImage from '$shared/components/FallbackImage'
import ProductContainer from '$shared/components/Container/Product'
import Tile from '$shared/components/Tile'
import { isCommunityProduct } from '$mp/utils/product'
import { ago } from '$shared/utils/time'

import ProductDetails from './ProductDetails'
import CollapsedText from '$mp/components/ProductPage/CollapsedText'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import ProductOverview from '$mp/components/ProductPage/ProductOverview'
import styles from './page.pcss'

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
    productSubscription?: Subscription,
    authApiKeyId?: ?ResourceKeyId,
    onPurchase?: () => void | Promise<void>,
    adminFee?: ?number,
    joinPartStreamId?: ?string,
    subscriberCount?: ?number,
    mostRecentPurchaseTimestamp?: ?Date,
}

class ProductDetailsPage extends Component<Props> {
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
            toolbarActions,
            showStreamActions,
            isLoggedIn,
            isProductSubscriptionValid,
            productSubscription,
            authApiKeyId,
            onPurchase,
            toolbarStatus,
            adminFee,
            joinPartStreamId,
            subscriberCount,
            mostRecentPurchaseTimestamp,
        } = this.props
        const isProductFree = (product && BN(product.pricePerSecond).isEqualTo(0)) || false
        const isCommunity = !!(product && isCommunityProduct(product))

        return !!product && (
            <div className={classNames(styles.productPage, !!showToolbar && styles.withToolbar)}>
                {showToolbar && (
                    <Toolbar left={toolbarStatus} actions={toolbarActions} />
                )}
                <Hero
                    className={styles.hero}
                    containerClassName={styles.heroContainer}
                    product={product}
                    leftContent={
                        <div className={styles.productImageWrapper}>
                            <FallbackImage
                                className={styles.productImage}
                                src={product.imageUrl || ''}
                                alt={product.name}
                            />
                            <Tile.Labels
                                topLeft
                                labels={{
                                    community: isCommunity,
                                }}
                            />
                        </div>
                    }
                    rightContent={
                        <ProductDetails
                            product={product}
                            isValidSubscription={!!isProductSubscriptionValid}
                            productSubscription={productSubscription}
                            onPurchase={() => onPurchase && onPurchase()}
                        />
                    }
                />
                <div className={styles.container}>
                    <ProductContainer>
                        <div className={styles.separator} />
                        <div className={styles.additionalInfo}>
                            <CollapsedText text={product.description} className={styles.description} />
                            <div className={styles.info}>
                                <div>
                                    <div className={styles.subheading}>Product category</div>
                                    <div>{product.category}</div>
                                </div>
                                {subscriberCount != null && (
                                    <div>
                                        <div className={styles.subheading}>Active subscribers</div>
                                        <div>{subscriberCount}</div>
                                    </div>
                                )}
                                {mostRecentPurchaseTimestamp != null && (
                                    <div>
                                        <div className={styles.subheading}>Most recent purchase</div>
                                        <div>{ago(mostRecentPurchaseTimestamp)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ProductContainer>
                </div>
                {isCommunity && (
                    <ProductContainer>
                        <ProductOverview
                            product={product}
                            authApiKeyId={authApiKeyId}
                            adminFee={adminFee || 0}
                            subscriberCount={subscriberCount || 0}
                            joinPartStreamId={joinPartStreamId}
                        />
                    </ProductContainer>
                )}
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
                    <MediaQuery minDeviceWidth={md.max}>
                        {(matches) => (
                            <Products
                                header={I18n.t('productPage.relatedProducts')}
                                products={matches ? relatedProducts : relatedProducts.slice(0, 2)}
                                type="relatedProducts"
                            />
                        )}
                    </MediaQuery>
                )}
            </div>
        )
    }
}

export default ProductDetailsPage
