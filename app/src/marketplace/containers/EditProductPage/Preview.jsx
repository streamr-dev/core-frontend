// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import useEditableProduct from '../ProductController/useEditableProduct'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useFilePreview from '$shared/hooks/useFilePreview'
import { isEthereumAddress } from '$mp/utils/validate'
import { ago } from '$shared/utils/time'

import DescriptionComponent from '$mp/components/ProductPage/Description'
import HeroComponent from '$mp/components/Hero'
import { ImageTile } from '$shared/components/Tile'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import Terms from '$mp/components/ProductPage/Terms'
import ProductPageDataUnionStats from '$mp/containers/ProductPage/DataUnionStats'
import useDataUnionStats from '$mp/containers/ProductPage/useDataUnionStats'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import usePending from '$shared/hooks/usePending'

import productPageStyles from '$mp/containers/ProductPage/page.pcss'
import heroStyles from '$mp/containers/ProductPage/hero.pcss'
import streamStyles from '$mp/containers/ProductPage/streams.pcss'

import styles from './preview.pcss'

const Hero = () => {
    const product = useEditableProduct()
    const isDataUnion = !!(product && isDataUnionProduct(product))
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
                <ImageTile
                    alt={product.name}
                    src={preview || product.imageUrl}
                    showDataUnionBadge={isDataUnion}
                />
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

    const contractProduct = useContractProduct()
    const { isPending } = usePending('contractProduct.LOAD_SUBSCRIPTION')
    const { purchaseTimestamp, subscriberCount } = contractProduct || {}

    const isProductFree = !!(product && !isPaidProduct(product))

    const sidebar = useMemo(() => ({
        category: {
            title: I18n.t('editProductPage.sidebar.category'),
            value: (category && category.name) || '-',
        },
        ...(!isProductFree ? {
            subscriberCount: {
                title: I18n.t('editProductPage.sidebar.activeSubscribers'),
                loading: isPending,
                value: subscriberCount || 0,
            },
            purchaseTimestamp: {
                title: I18n.t('editProductPage.sidebar.mostRecentPurchase'),
                loading: isPending,
                value: purchaseTimestamp != null ? ago(new Date(purchaseTimestamp)) : '-',
            },
        } : {}),
    }), [category, isProductFree, subscriberCount, purchaseTimestamp, isPending])

    return (
        <DescriptionComponent
            description={product.description}
            sidebar={sidebar}
        />
    )
}

const DataUnionStats = () => {
    const product = useEditableProduct()

    const { created, adminFee } = product

    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isDuDeployed = !!isDataUnion && !!product.dataUnionDeployed && isEthereumAddress(product.beneficiaryAddress)

    const { stats, memberCount } = useDataUnionStats()
    const dataUnion = useDataUnion()
    const { joinPartStreamId } = dataUnion || {}

    const statsProps = useMemo(() => {
        if (isDuDeployed) {
            return {
                stats,
                memberCount,
                joinPartStreamId,
            }
        }

        return {
            stats: [{
                id: 'revenue',
                unit: 'DATA',
                value: '0',
            }, {
                id: 'members',
                value: '0',
            }, {
                id: 'averageRevenue',
                unit: 'DATA',
                value: '0',
            }, {
                id: 'subscribers',
                value: '0',
            }, {
                id: 'adminFee',
                unit: '%',
                value: adminFee ? (adminFee * 100).toFixed(0) : '0',
            }, {
                id: 'created',
                value: created ? new Date(created).toLocaleDateString() : '-',
            }],
            memberCount: {
                total: 0,
                active: 0,
                inactive: 0,
            },
        }
    }, [isDuDeployed, stats, memberCount, joinPartStreamId, created, adminFee])

    return (
        <ProductPageDataUnionStats {...statsProps} />
    )
}

const Streams = () => {
    const product = useEditableProduct()
    const streamIds = product.streams
    const streamIdSet = useMemo(() => new Set(streamIds), [streamIds])
    const streams = useSelector(selectStreams)
    const selectedStreams = useMemo(() => streams.filter(({ id }) => streamIdSet.has(id)), [streamIdSet, streams])
    const isProductFree = !!(product && !isPaidProduct(product))
    const fetchingAllStreams = useSelector(selectFetchingStreams)

    return (
        <StreamListing
            product={product}
            streams={selectedStreams}
            fetchingStreams={fetchingAllStreams}
            showStreamActions={false}
            isLoggedIn={false}
            isProductSubscriptionValid={false}
            isProductFree={isProductFree}
            className={streamStyles.section}
        />
    )
}

const TermsOfUse = () => {
    const product = useEditableProduct()

    return (
        <Terms
            product={product}
        />
    )
}

const Preview = () => {
    const product = useEditableProduct()

    const isDataUnion = !!(product && isDataUnionProduct(product))

    // scroll to the top
    useEffect(() => {
        window.scroll({
            top: 0,
        })
    }, [])

    return (
        <div className={cx(productPageStyles.productPage, styles.preview)}>
            <Hero />
            <Description />
            {isDataUnion && (
                <DataUnionStats />
            )}
            <Streams />
            <TermsOfUse />
        </div>
    )
}

export default Preview
