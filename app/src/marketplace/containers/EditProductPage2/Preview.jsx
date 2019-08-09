// @flow

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import useProduct from '../ProductController/useProduct'
import { selectStreams } from '$mp/modules/streams/selectors'

import Hero from '$mp/components/Hero'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import FallbackImage from '$shared/components/FallbackImage'
import StreamListing from '$mp/components/ProductPage/StreamListing'

import styles from './preview.pcss'

const Preview = () => {
    const product = useProduct()
    const streamIds = product.streams
    const streams = useSelector(selectStreams) // todo: safe to assume streams are fetched?

    const selectedStreams = useMemo(() => streams.filter((s) => streamIds.includes(s.id)), [streamIds, streams])

    return (
        <div>
            <Hero
                product={product}
                leftContent={
                    <FallbackImage
                        className={styles.productImage}
                        src={(product.imageUrl && product.imageUrl.preview) || product.imageUrl}
                        alt={product.name}
                    />
                }
                rightContent={
                    <ProductDetails
                        product={product}
                        isValidSubscription={false}
                        onPurchase={() => {}}
                    />
                }
            />
            <StreamListing
                product={product}
                streams={selectedStreams}
                fetchingStreams={false}
                showStreamActions={false}
                isLoggedIn
                isProductSubscriptionValid={false}
                isProductFree={product.isFree}
                className={styles.section}
            />
        </div>
    )
}

export default Preview
