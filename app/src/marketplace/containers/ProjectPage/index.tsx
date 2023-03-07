import React, {FunctionComponent, ReactNode, useMemo} from 'react'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import Nav from '$shared/components/Layout/Nav'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import styles from '$shared/components/Layout/layout.pcss'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import routes from '$routes'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import PurchaseModal from './PurchaseModal'
import Page from './Page'
import { getProjectDetailsLinkTabs, getProjectTitle } from './utils'
const ProjectPage = () => {
    const {loadedProject: project} = useLoadedProject()
    const pageTitle = useMemo<ReactNode>(() => getProjectTitle(project), [project])
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project])

    return (
        <Layout nav={<Nav />} innerClassName={styles.greyInner}>
            <MarketplaceHelmet title={project?.name} />
            <DetailsPageHeader
                backButtonLink={routes.marketplace.index}
                pageTitle={pageTitle}
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
