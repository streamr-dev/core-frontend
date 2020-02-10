// @flow

import React from 'react'

import { isDataUnionProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'

import Hero from './Hero'
import Description from './Description'
import DataUnionStats from './DataUnionStats'
import Streams from './Streams'
import RelatedProducts from './RelatedProducts'

import styles from './page.pcss'

const ProductDetailsPage = () => {
    const product = useProduct()
    const isDataUnion = !!(product && isDataUnionProduct(product))

    return (
        <div className={styles.productPage}>
            <Hero />
            <Description />
            {isDataUnion && (
                <DataUnionStats />
            )}
            <Streams />
            <RelatedProducts />
        </div>
    )
}

export default ProductDetailsPage
