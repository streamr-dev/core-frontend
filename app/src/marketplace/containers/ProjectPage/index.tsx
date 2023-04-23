import React, {FunctionComponent, useMemo } from 'react'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import Nav from '$shared/components/Layout/Nav'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import styles from '$shared/components/Layout/layout.pcss'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {ProjectPageTitle} from "$mp/components/PageTitle"
import ProjectLinkTabs from '$app/src/pages/ProjectPage/ProjectLinkTabs'
import routes from '$routes'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import Page from './Page'

const ProjectPage = () => {
    const {loadedProject: project} = useLoadedProject()

    return (
        <Layout nav={<Nav />} innerClassName={styles.greyInner}>
            <MarketplaceHelmet title={project?.name} />
            <DetailsPageHeader
                backButtonLink={routes.projects.index}
                pageTitle={<ProjectPageTitle/>}
                rightComponent={<ProjectLinkTabs projectId={project?.id || undefined} />}
            />
            <Page />
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
