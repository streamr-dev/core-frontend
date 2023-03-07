import React, { FunctionComponent, ReactNode, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import ProductController, { useController } from '$mp/containers/ProductController'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import usePending from '$shared/hooks/usePending'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import routes from '$routes'
import { getProjectDetailsLinkTabs, getProjectTitle } from './utils'

const ProjectLiveData: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const pageTitle = useMemo<ReactNode>(() => getProjectTitle(project), [project])
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project.id])

    return <Layout nav={<Nav />}>
        <MarketplaceHelmet title={project.name} />
        <DetailsPageHeader
            backButtonLink={routes.marketplace.index}
            pageTitle={pageTitle}
            linkTabs={linkTabs}
        />
        {/*<LoadingIndicator loading={isPending} />*/}
        <p style={{color: 'black'}}>Live Data page content will be here</p>
    </Layout>
}

const ProjectLiveDataPageWrap = () => {
    const { product, hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <MarketplaceLoadingView />
    }

    const key = (!!product && product.id) || ''
    return <ProjectLiveData key={key} />
}

const ProjectLiveDataPage: FunctionComponent = () => {
    const { id } = useParams<{id: string}>()
    return (
        <ProductController key={id} ignoreUnauthorized requirePublished>
            <ProjectLiveDataPageWrap />
        </ProductController>
    )
}

export default ProjectLiveDataPage
