import React, { FunctionComponent, ReactNode, useMemo } from 'react'
import styled from 'styled-components'
import Nav from '$shared/components/Layout/Nav'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import PurchaseModal from '$mp/containers/ProjectPage/PurchaseModal'
import { MarketplaceLoadingView } from '$mp/containers/ProjectPage/MarketplaceLoadingView'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { Connect } from '$mp/containers/ProjectPage/Connect'
import styles from '$shared/components/Layout/layout.pcss'
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import { getProjectDetailsLinkTabs, getProjectTitle } from './utils'

const PageTitleText = styled.p`
  font-size: 14px;
  line-height: 32px;
  margin-top: 8px;
  margin-bottom: 0;
`

const ProjectConnect: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const linkTabs = useMemo(() => getProjectDetailsLinkTabs(project.id), [project.id])

    const PageTitle = useMemo<ReactNode>(() => {
        return <PageTitleText>{getProjectTitle(project)}</PageTitleText>
    }, [project])

    return <Layout nav={<Nav/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={project.name}/>
        <DetailsPageHeader
            pageTitle={PageTitle}
            linkTabs={linkTabs}
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
