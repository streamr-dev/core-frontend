import React, { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import routes from '$routes'
import ProductController, { useController } from '../ProductController'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import PurchaseModal from './PurchaseModal'
import Page from './Page'
import { getProjectDetailsLinkTabs, getProjectTitle } from './utils'

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

    const pageTitle = useMemo<ReactNode>(() => getProjectTitle(product), [product])
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(productId), [productId])

    return (
        <Layout nav={<Nav />}>
            <MarketplaceHelmet title={product.name} />
            <DetailsPageHeader
                backButtonLink={routes.marketplace.index}
                pageTitle={pageTitle}
                currentPageUrl={ routes.marketplace.product.overview({id: productId})}
                linkTabs={linkTabs}
            />
            <LoadingIndicator loading={isPending} />
            <Page />
            <PurchaseModal />
            <WhitelistRequestAccessModal />
        </Layout>
    )
}

const ProjectPageWrap = () => {
    const { product, hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <MarketplaceLoadingView />
    }

    const key = (!!product && product.id) || ''
    return <ProjectPage key={key} />
}

const ProjectContainer = () => {
    const { id } = useParams<{id: string}>()
    return (
        <ProductController key={id} ignoreUnauthorized requirePublished useAuthorization={false}>
            <ProjectPageWrap />
        </ProductController>
    )
}

export default ProjectContainer
