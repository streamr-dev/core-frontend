// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import MediaQuery from 'react-responsive'
import cx from 'classnames'

import useEditableProduct from '../ProductController/useEditableProduct'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useFilePreview from '$shared/hooks/useFilePreview'
import { lg } from '$app/scripts/breakpoints'

import DescriptionComponent from '$mp/components/ProductPage/Description'
import HeroComponent from '$mp/components/Hero'
import { ImageTile } from '$shared/components/Tile'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import ProductContainer from '$shared/components/Container/Product'
import StatsValues from '$shared/components/DataUnionStats/Values'
import StatsHeader from '$shared/components/DataUnionStats/Header'
import DonutChart from '$shared/components/DonutChart'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import WithShownDays from '$shared/components/TimeSeriesGraph/WithShownDays'

import productPageStyles from '$mp/containers/ProductPage/page.pcss'
import heroStyles from '$mp/containers/ProductPage/hero.pcss'
import streamStyles from '$mp/containers/ProductPage/streams.pcss'
import statsStyles from '$mp/containers/ProductPage/dataUnionStats.pcss'

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

const DataUnionStats = () => {
    const product = useEditableProduct()

    const { created, adminFee } = product

    return (
        <ProductContainer className={statsStyles.container}>
            <div className={statsStyles.root}>
                <div className={statsStyles.grid}>
                    <div className={statsStyles.header}>
                        <span>Overview</span>
                    </div>
                    <StatsValues
                        className={statsStyles.stats}
                        stats={[{
                            id: 'revenue',
                            label: 'Total product revenue',
                            unit: 'DATA',
                            value: '0',
                        }, {
                            id: 'members',
                            label: 'Active Members',
                            value: '0',
                        }, {
                            id: 'averageRevenue',
                            label: 'Avg rev member / month',
                            unit: 'DATA',
                            value: '0',
                        }, {
                            id: 'subscribers',
                            label: 'Subscribers',
                            value: '0',
                        }, {
                            id: 'adminFee',
                            label: 'Admin Fee',
                            unit: '%',
                            value: adminFee ? (adminFee * 100).toFixed(0) : '0',
                        }, {
                            id: 'created',
                            label: 'Product created',
                            value: created ? new Date(created).toLocaleDateString() : '-',
                        }]}
                    />
                    <div className={statsStyles.graphs}>
                        <MediaQuery maxWidth={lg.max}>
                            {(isTabletOrMobile: boolean) => (
                                <WithShownDays
                                    label="Members"
                                    className={statsStyles.membersGraph}
                                    disabled
                                >
                                    {({ shownDays: days }) => (
                                        <TimeSeriesGraph
                                            width={isTabletOrMobile ? 380 : 540}
                                            height={200}
                                            graphData={[{
                                                x: new Date().getTime(),
                                                y: 0,
                                            }]}
                                            shownDays={days}
                                        />
                                    )}
                                </WithShownDays>
                            )}
                        </MediaQuery>
                        <div className={statsStyles.memberDonut}>
                            <StatsHeader>Members by status</StatsHeader>
                            <DonutChart
                                className={statsStyles.donutChart}
                                strokeWidth={3}
                                data={[
                                    {
                                        title: 'Active',
                                        value: 0,
                                        color: '#D8D8D8',
                                    },
                                    {
                                        title: 'Inactive',
                                        value: 0,
                                        color: '#D8D8D8',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div className={statsStyles.footer} />
            </div>
        </ProductContainer>
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
        </div>
    )
}

export default Preview
