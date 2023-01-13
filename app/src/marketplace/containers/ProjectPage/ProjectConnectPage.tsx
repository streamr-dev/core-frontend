import React, { FunctionComponent, ReactNode, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import ProductController, { useController } from '$mp/containers/ProductController'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import usePending from '$shared/hooks/usePending'
import PurchaseModal from '$mp/containers/ProjectPage/PurchaseModal'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import { Connect } from '$mp/containers/ProjectPage/Connect'
import { useLoadAdditionalProductData } from '$shared/hooks/useLoadAdditionalProductData'
import { getProjectDetailsLinkTabs, getProjectTitle } from './utils'

const PageTitleText = styled.p`
  font-size: 14px;
  line-height: 32px;
  margin-top: 8px;
  margin-bottom: 0;
`

const ProjectConnect: FunctionComponent = () => {
    const { product } = useController()
    const { isPending } = usePending('contractProduct.LOAD')
    const { id: productId } = useParams<{id: string}>()
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(productId), [productId])
    useLoadAdditionalProductData()

    const PageTitle = useMemo<ReactNode>(() => {
        return <PageTitleText>{getProjectTitle(product)}</PageTitleText>
    }, [product])

    return <Layout nav={<Nav/>}>
        <MarketplaceHelmet title={product.name}/>
        <DetailsPageHeader
            pageTitle={PageTitle}
            linkTabs={linkTabs}
        />
        <LoadingIndicator loading={isPending}/>
        <Connect/>
        <PurchaseModal/>
    </Layout>
}

const ProjectConnectPageWrap = () => {
    const { product, hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <MarketplaceLoadingView />
    }

    const key = (!!product && product.id) || ''
    return <ProjectConnect key={key} />
}

const ProjectConnectPage: FunctionComponent = () => {
    const { id } = useParams<{id: string}>()
    return (
        <ProductController key={id} ignoreUnauthorized requirePublished useAuthorization={false}>
            <ProjectConnectPageWrap />
        </ProductController>
    )
}

export default ProjectConnectPage
