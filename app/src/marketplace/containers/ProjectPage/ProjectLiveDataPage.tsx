import React, {FunctionComponent, useMemo} from 'react'
import CoreLayout from "$shared/components/Layout/Core"
import ProjectPage, { ProjectPageContainer } from '$shared/components/ProjectPage'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {GetAccess} from "$mp/components/GetAccess/GetAccess"
import {ProjectPageTitle} from "$mp/components/PageTitle"
import {useUserHasAccessToProject} from "$mp/containers/ProductController/useUserHasAccessToProject"
import {StreamPreview} from "$shared/components/StreamPreview"
import routes from '$routes'
import { getProjectDetailsLinkTabs } from './utils'
const ProjectLiveData: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project.id])

    const userHasAccess: boolean = useUserHasAccessToProject()

    return <CoreLayout>
        <MarketplaceHelmet title={project.name} />
        <DetailsPageHeader
            backButtonLink={routes.marketplace.index}
            pageTitle={<ProjectPageTitle/>}
            linkTabs={linkTabs}
        />
        {
            userHasAccess
                ? <StreamPreview streamsList={project.streams}/>
                : <ProjectPage>
                    <ProjectPageContainer>
                        <GetAccess project={project}/>
                    </ProjectPageContainer>
                </ProjectPage>
        }
    </CoreLayout>
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
