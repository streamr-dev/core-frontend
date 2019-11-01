// @flow

import React from 'react'
import BN from 'bignumber.js'
import MediaQuery from 'react-responsive'
import breakpoints from '$app/scripts/breakpoints'
import { I18n } from 'react-redux-i18n'

import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import Products from '$mp/components/Products'
import { isCommunityProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'

import StreamListing from '$mp/components/ProductPage/StreamListing'

import Hero from './Hero'
import Description from './Description'
import CommunityStats from './CommunityStats'

import styles from './page.pcss'

const { md } = breakpoints

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    relatedProducts: Array<Product>,
    showStreamActions?: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
}

const ProductDetailsPage = ({
    streams,
    fetchingStreams,
    relatedProducts,
    showStreamActions,
    isLoggedIn,
    isProductSubscriptionValid,
}: Props) => {
    const product = useProduct()
    const isProductFree = (product && BN(product.pricePerSecond).isEqualTo(0)) || false
    const isCommunity = !!(product && isCommunityProduct(product))

    return (
        <div className={styles.productPage}>
            <Hero />
            <Description />
            {isCommunity && (
                <CommunityStats />
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

ProductDetailsPage.defaultProps = {
    fetchingStreams: false,
    showRelated: true,
    showToolbar: false,
}

export default ProductDetailsPage
