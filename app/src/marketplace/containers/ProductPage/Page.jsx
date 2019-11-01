// @flow

import React from 'react'

import { isCommunityProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'

import Hero from './Hero'
import Description from './Description'
import CommunityStats from './CommunityStats'
import Streams from './Streams'
import RelatedProducts from './RelatedProducts'

import styles from './page.pcss'

const ProductDetailsPage = () => {
    const product = useProduct()
    const isCommunity = !!(product && isCommunityProduct(product))

    return (
        <div className={styles.productPage}>
            <Hero />
            <Description />
            {isCommunity && (
                <CommunityStats />
            )}
            <Streams />
            <RelatedProducts />
        </div>
    )
}

export default ProductDetailsPage
