import React, { FunctionComponent, useMemo } from 'react'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import PurchaseModal from '$mp/containers/ProjectPage/PurchaseModal'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { Connect } from '$mp/containers/ProjectPage/Connect'
import styles from '$shared/components/Layout/layout.pcss'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {ProjectPageTitle} from "$mp/components/PageTitle"
import ProjectLinkTabs from '$app/src/pages/ProjectPage/ProjectLinkTabs'
import routes from "$routes"

const ProjectConnect: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()

    return <Layout nav={<Nav/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={project.name}/>
        <DetailsPageHeader
            backButtonLink={routes.projects.index}
            pageTitle={<ProjectPageTitle/>}
            rightComponent={<ProjectLinkTabs projectId={project?.id || undefined} />}
        />
        {/*<LoadingIndicator loading={isPending}/>*/}
        <Connect/>
        <PurchaseModal/>
    </Layout>
}

const ProjectConnectPageWrap = () => {
    const {loadedProject: project} = useLoadedProject()

    if (!project) {
        return <MarketplaceLoadingView />
    }

    const key = (!!project && project.id) || ''
    return <ProjectConnect key={key} />
}

const ProjectConnectPage: FunctionComponent = () => {
    return (
        <LoadedProjectContextProvider>
            <ProjectConnectPageWrap />
        </LoadedProjectContextProvider>
    )
}

export default ProjectConnectPage
