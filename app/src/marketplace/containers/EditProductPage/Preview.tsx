import React, { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Segment from '$shared/components/Segment'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import { isDataUnionProduct, isPaidProject } from '$mp/utils/product'
import useFilePreview from '$shared/hooks/useFilePreview'
import { isEthereumAddress } from '$mp/utils/validate'
import DescriptionComponent from '$mp/components/ProductPage/Description'
import HeroComponent from '$mp/components/Hero'
import { ImageTile } from '$shared/components/Tile'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import Terms from '$mp/components/ProductPage/Terms'
import ProductPageDataUnionStats from '$mp/containers/ProjectPage/DataUnionStats'
import useDataUnionServerStats from '$mp/containers/ProjectPage/useDataUnionServerStats'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import usePending from '$shared/hooks/usePending'
import ProjectPage, {
    ProjectPageContainer,
    ProjectPageHero,
    ProjectPageSeparator
} from '$shared/components/ProjectPage'
import { MD, XL } from '$shared/utils/styled'
import usePreviewStats from '$mp/containers/ProjectPage/usePreviewStats'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { useController } from '../ProductController'

const Hero = () => {
    const { state: product } = useEditableState()
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const contractProduct = useSelector(selectContractProduct)
    const { preview, createPreview } = useFilePreview()
    const uploadedImage = product.newImageToUpload
    useEffect(() => {
        if (!uploadedImage) {
            return
        }

        createPreview(uploadedImage)
    }, [uploadedImage, createPreview])
    return (
        <HeroComponent
            leftContent={
                <ImageTile alt={product.name} src={preview || product.imageUrl} showDataUnionBadge={isDataUnion} />
            }
            rightContent={
                <ProductDetails
                    product={product}
                    pricingTokenAddress={contractProduct && contractProduct.pricingTokenAddress}
                    isValidSubscription={false}
                    productSubscription={undefined}
                    onPurchase={() => {}}
                />
            }
        />
    )
}

const Description = () => {
    const { state: product } = useEditableState()
    const categories = useSelector(selectAllCategories)
    const productCategory = product.category
    const category = useMemo(
        () => (categories || []).find(({ id }) => id === productCategory),
        [productCategory, categories],
    )
    const sidebar = useMemo(
        () => ({
            category: {
                title: 'Product category',
                value: (category && category.name) || '-',
            },
        }),
        [category],
    )
    return <DescriptionComponent description={product.description} sidebar={sidebar} />
}

const DataUnionStats = () => {
    const { state: product } = useEditableState()
    const chainId = product && getChainIdFromApiString(product.chain)
    const { created, adminFee, dataUnionDeployed, beneficiaryAddress } = product
    const isDuDeployed = !!dataUnionDeployed && isEthereumAddress(beneficiaryAddress)
    const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()
    const dataUnion = useDataUnion()
    const contractProduct = useContractProduct()
    const { subscriberCount } = contractProduct || {
        subscriberCount: 0,
    }
    const stats = usePreviewStats({
        created,
        adminFee,
        memberCount,
        subscriberCount,
        totalEarnings,
    })
    useEffect(() => {
        if (beneficiaryAddress) {
            startPolling(beneficiaryAddress, chainId)
            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, beneficiaryAddress, chainId])
    const statsProps = useMemo(() => {
        if (isDuDeployed) {
            return {
                stats,
                memberCount,
                dataUnion,
            }
        }

        return {
            stats: [
                {
                    id: 'revenue',
                    unit: 'DATA',
                    value: '0',
                },
                {
                    id: 'members',
                    value: '0',
                },
                {
                    id: 'averageRevenue',
                    unit: 'DATA',
                    value: '0',
                },
                {
                    id: 'subscribers',
                    value: '0',
                },
                {
                    id: 'revenueShare',
                    unit: '%',
                    value: adminFee ? ((1 - adminFee) * 100).toFixed(0) : '0',
                },
                {
                    id: 'created',
                    value: created ? new Date(created).toLocaleDateString() : '-',
                },
            ],
            memberCount: {
                total: 0,
                active: 0,
                inactive: 0,
            },
        }
    }, [isDuDeployed, stats, memberCount, created, adminFee, dataUnion])
    return <ProductPageDataUnionStats {...statsProps} />
}

const Streams = () => {
    const { state: product } = useEditableState()
    const { allStreams: streams } = useController()
    const streamIds = product.streams
    const streamIdSet = useMemo(() => new Set(streamIds), [streamIds])
    const selectedStreams = useMemo(() => streams.filter(({ id }) => streamIdSet.has(id)), [streamIdSet, streams])
    const isProductFree = !!(product && !isPaidProject(product))
    const { isPending: fetchingAllStreams } = usePending('product.LOAD_ALL_STREAMS')
    return (
        <Segment>
            <Segment.Body>
                <StreamListing
                    product={product}
                    streams={selectedStreams}
                    fetchingStreams={fetchingAllStreams}
                    showStreamActions={false}
                    isLoggedIn={false}
                    isProductSubscriptionValid={false}
                    isProductFree={isProductFree}
                />
            </Segment.Body>
        </Segment>
    )
}

const UnstyledPreview = (props) => {
    const { state: product } = useEditableState()
    const isDataUnion = !!(product && isDataUnionProduct(product))
    // scroll to the top
    useEffect(() => {
        window.scroll({
            top: 0,
        })
    }, [])
    return (
        <ProjectPage {...props}>
            <ProjectPageHero>
                <ProjectPageContainer>
                    <ProjectPageContainer>
                        <Hero />
                        <ProjectPageSeparator />
                        <Description />
                    </ProjectPageContainer>
                </ProjectPageContainer>
            </ProjectPageHero>
            <ProjectPageContainer>
                {isDataUnion && <DataUnionStats />}
                <Streams />
                <Terms product={product} />
            </ProjectPageContainer>
        </ProjectPage>
    )
}

const Preview = styled(UnstyledPreview)`
    padding-bottom: 96px;

    @media (min-width: ${MD}px) {
        padding-bottom: 48px;
    }

    @media (min-width: ${XL}px) {
        padding-bottom: 64px;
    }
`
export default Preview
