// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import useEditableProduct from '../ProductController/useEditableProduct'
import { selectStreams } from '$mp/modules/streams/selectors'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import { isCommunityProduct, isPaidProduct } from '$mp/utils/product'
import useFilePreview from '$shared/hooks/useFilePreview'

import DescriptionComponent from '$mp/components/ProductPage/Description'
import HeroComponent from '$mp/components/Hero'
import FallbackImage from '$shared/components/FallbackImage'
import Tile from '$shared/components/Tile'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import StreamListing from '$mp/components/ProductPage/StreamListing'

import productPageStyles from '$mp/containers/ProductPage/page.pcss'
import heroStyles from '$mp/containers/ProductPage/hero.pcss'
import streamStyles from '$mp/containers/ProductPage/streams.pcss'

const Hero = () => {
    const product = useEditableProduct()
    const isCommunity = !!(product && isCommunityProduct(product))
    const { preview, createPreview } = useFilePreview()

    const uploadedImage = product.newImageToUpload

    useEffect(() => {
        if (!uploadedImage) { return }

        createPreview(uploadedImage)
    }, [uploadedImage, createPreview])

    return (
        <HeroComponent
            className={heroStyles.hero}
            containerClassName={heroStyles.heroContainer}
            product={product}
            leftContent={
                <div className={heroStyles.productImageWrapper}>
                    <FallbackImage
                        className={heroStyles.productImage}
                        src={preview || product.imageUrl || ''}
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
                    isValidSubscription={false}
                    productSubscription={undefined}
                    onPurchase={() => {}}
                />
            }
        />
    )
}

const Description = () => {
    const product = useEditableProduct()
    const categories = useSelector(selectAllCategories)

    const productCategory = product.category
    const category = useMemo(() => (
        (categories || []).find(({ id }) => id === productCategory)
    ), [productCategory, categories])

    const sidebar = useMemo(() => ({
        category: {
            title: I18n.t('editProductPage.sidebar.category'),
            value: (category && category.name) || '-',
        },
        subscriberCount: {
            title: I18n.t('editProductPage.sidebar.activeSubscribers'),
            value: 0,
        },
        purchaseTimestamp: {
            title: I18n.t('editProductPage.sidebar.mostRecentPurchase'),
            value: '-',
        },
    }), [category])

    return (
        <DescriptionComponent
            description={product.description}
            sidebar={sidebar}
        />
    )
}

const CommunityStats = () => (
    <div>
        stats
    </div>
)

const Streams = () => {
    const product = useEditableProduct()
    const streamIds = product.streams
    const streams = useSelector(selectStreams) // todo: safe to assume streams are fetched?
    const selectedStreams = useMemo(() => streams.filter((s) => streamIds.includes(s.id)), [streamIds, streams])
    const isProductFree = !!(product && !isPaidProduct(product))

    return (
        <StreamListing
            product={product}
            streams={selectedStreams}
            fetchingStreams={false}
            showStreamActions={false}
            isLoggedIn={false}
            isProductSubscriptionValid={false}
            isProductFree={isProductFree}
            className={streamStyles.section}
        />
    )
}

const Preview = () => {
    const product = useEditableProduct()

    const isCommunity = !!(product && isCommunityProduct(product))

    // scroll to the top
    useEffect(() => {
        window.scroll({
            top: 0,
        })
    }, [])

    return (
        <div className={productPageStyles.productPage}>
            <Hero />
            <Description />
            {isCommunity && (
                <CommunityStats />
            )}
            <Streams />
        </div>
    )
}

export default Preview
