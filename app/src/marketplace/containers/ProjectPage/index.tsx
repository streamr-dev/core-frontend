import React, { useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import type { ProjectId } from '$mp/types/project-types'
import usePending from '$shared/hooks/usePending'
import { getProductSubscription } from '$mp/modules/product/actions'
import PrestyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Nav from '$shared/components/Layout/Nav'
import { selectUserData } from '$shared/modules/user/selectors'
import { useSessionToken } from '$shared/reducers/session'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import routes from '$routes'
import ProductController, { useController } from '../ProductController'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import PurchaseModal from './PurchaseModal'
import Page from './Page'
const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    top: 2px;
`

const ProjectPage = () => {
    const dispatch = useDispatch()
    const { product, loadCategories, loadDataUnion, loadRelatedProducts } = useController()
    const userData = useSelector(selectUserData)
    const token = useSessionToken()
    const isLoggedIn = userData !== null && !!token
    const { isPending } = usePending('contractProduct.LOAD')
    const { id: productId } = useParams<{id: string}>()
    const chainId = getChainIdFromApiString(product.chain)
    const loadAdditionalProductData = useCallback(
        async (id: ProjectId) => {
            loadCategories()
            loadRelatedProducts(id, isLoggedIn)

            if (isLoggedIn) {
                dispatch(getProductSubscription(id, chainId))
            }
        },
        [dispatch, isLoggedIn, loadCategories, loadRelatedProducts, chainId],
    )
    useEffect(() => {
        loadAdditionalProductData(productId)
    }, [loadAdditionalProductData, productId])
    const { dataUnionDeployed, beneficiaryAddress } = product
    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress, chainId)
        }
    }, [dataUnionDeployed, beneficiaryAddress, chainId, loadDataUnion])

    const pageTitle = useMemo<ReactNode>(
        () => <>{product.name} by <strong>{product.owner}</strong></>,
        [product])

    return (
        <Layout nav={<Nav />}>
            <MarketplaceHelmet title={product.name} />
            <DetailsPageHeader
                backButtonLink={routes.marketplace.index}
                pageTitle={pageTitle}
                currentPageUrl={ routes.marketplace.product.overview({id: productId})}
                linkTabs={[
                    {
                        label: 'Project overview',
                        href:  routes.marketplace.product.overview({id: productId})
                    },
                    {
                        label: 'Connect',
                        href:  routes.marketplace.product.connect({id: productId})
                    },
                    {
                        label: 'Live data',
                        href:  routes.marketplace.product.liveData({id: productId})
                    }
                ]}
            />
            <LoadingIndicator loading={isPending} />
            <Page />
            <PurchaseModal />
            <WhitelistRequestAccessModal />
        </Layout>
    )
}

const LoadingView = () => (
    <Layout>
        <MarketplaceHelmet />
        <LoadingIndicator loading />
    </Layout>
)

const EditWrap = () => {
    const { product, hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''
    return <ProjectPage key={key} />
}

const ProjectContainer = () => {
    const { id } = useParams<{id: string}>()
    return (
        <ProductController key={id} ignoreUnauthorized requirePublished useAuthorization={false}>
            <EditWrap />
        </ProductController>
    )
}

export default ProjectContainer
