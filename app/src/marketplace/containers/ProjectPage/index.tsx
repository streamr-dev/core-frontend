import React, {FunctionComponent, useMemo } from 'react'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import Nav from '$shared/components/Layout/Nav'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import styles from '$shared/components/Layout/layout.pcss'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {ProjectPageTitle} from "$mp/components/PageTitle"
import routes from '$routes'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import PurchaseModal from './PurchaseModal'
import Page from './Page'
import { getProjectDetailsLinkTabs } from './utils'

const ProjectPage = () => {
    const {loadedProject: project} = useLoadedProject()
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project])

    return (
        <Layout nav={<Nav />} innerClassName={styles.greyInner}>
            <MarketplaceHelmet title={project?.name} />
            <DetailsPageHeader
                backButtonLink={routes.marketplace.index}
                pageTitle={<ProjectPageTitle/>}
                linkTabs={linkTabs}
            />
            <Page />
            <PurchaseModal />
            <WhitelistRequestAccessModal />
        </Layout>
    )
}

const ProjectPageWrap = () => {
    const {loadedProject} = useLoadedProject()

    if (!loadedProject) {
        return <MarketplaceLoadingView />
    }

    const key = (!!loadedProject && loadedProject.id) || ''
    return <ProjectPage key={key} />
}

const ProjectContainer: FunctionComponent = () => {
    return (
        <LoadedProjectContextProvider>
            <ProjectPageWrap />
        </LoadedProjectContextProvider>
    )
}

export default ProjectContainer
