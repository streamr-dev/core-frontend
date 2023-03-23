import React, {FunctionComponent, useMemo} from 'react'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import ProjectPage, { ProjectPageContainer } from '$shared/components/ProjectPage'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {GetAccess} from "$mp/components/GetAccess/GetAccess"
import {WhiteBox} from "$shared/components/WhiteBox"
import {ProjectPageTitle} from "$mp/components/PageTitle"
import styles from '$shared/components/Layout/layout.pcss'
import {useUserHasAccessToProject} from "$mp/containers/ProductController/useUserHasAccessToProject"
import routes from '$routes'
import { getProjectDetailsLinkTabs } from './utils'

const ProjectLiveData: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project.id])

    const userHasAccess: boolean = useUserHasAccessToProject()

    return <Layout nav={<Nav />} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={project.name} />
        <DetailsPageHeader
            backButtonLink={routes.marketplace.index}
            pageTitle={<ProjectPageTitle/>}
            linkTabs={linkTabs}
        />
        {/*{permissionsLoading && <LoadingIndicator loading={permissionsLoading}/>}*/}
        <ProjectPage>
            <ProjectPageContainer>
                {userHasAccess ?
                    <WhiteBox>
                        <p style={{color: 'black'}}>Live Data page content will be here
                        </p>
                    </WhiteBox>
                    : <GetAccess project={project}/>}
            </ProjectPageContainer>
        </ProjectPage>
    </Layout>
}

const ProjectLiveDataPageWrap = () => {
    const { loadedProject: project} = useLoadedProject()

    if (!project) {
        return <MarketplaceLoadingView />
    }

    const key = (!!project && project.id) || ''
    return <ProjectLiveData key={key} />
}

const ProjectLiveDataPage: FunctionComponent = () => {
    return (
        <LoadedProjectContextProvider>
            <ProjectLiveDataPageWrap />
        </LoadedProjectContextProvider>
    )
}

export default ProjectLiveDataPage
