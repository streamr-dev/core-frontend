import React, { FunctionComponent, ReactNode, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import ProductController, { useController } from '$mp/containers/ProductController'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import usePending from '$shared/hooks/usePending'
import SelectField2 from '$mp/components/SelectField2'
import PurchaseModal from '$mp/containers/ProjectPage/PurchaseModal'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import { Connect } from '$mp/containers/ProjectPage/Connect'
import { SelectedStreamContext } from '$mp/containers/SelectedStreamContext/SelectedStreamContext'
import { useLoadAdditionalProductData } from '$shared/hooks/useLoadAdditionalProductData'
import { useUserHasAccessToProject } from '$mp/containers/ProductController/useUserHasAccessToProject'
import routes from '$routes'
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
    const [selectedStream, setSelectedStream] = useState<string>(product.streams[0])
    const userHasAccess: boolean = useUserHasAccessToProject()
    useLoadAdditionalProductData()

    const PageTitle = useMemo<ReactNode>(() => {
        return <div>
            {userHasAccess &&
                <SelectField2 placeholder={''}
                    options={product?.streams.map((streamId) => ({value: streamId, label: streamId}))}
                    value={product?.streams[0]}
                    isClearable={false}
                    onChange={(streamId) => {
                        setSelectedStream(streamId)
                    }}/>}
            <PageTitleText>{getProjectTitle(product)}</PageTitleText>
        </div>
    }, [product])

    return <SelectedStreamContext.Provider value={selectedStream}>
        <Layout nav={<Nav/>}>
            <MarketplaceHelmet title={product.name}/>
            <DetailsPageHeader
                pageTitle={PageTitle}
                linkTabs={linkTabs}
            />
            <LoadingIndicator loading={isPending}/>
            <Connect/>
            <PurchaseModal/>
        </Layout>
    </SelectedStreamContext.Provider>
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
