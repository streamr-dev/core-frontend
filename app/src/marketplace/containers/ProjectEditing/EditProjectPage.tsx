import React, {FunctionComponent, ReactNode, useContext, useEffect, useMemo} from "react"
import styled from "styled-components"
import {isEqual} from "lodash"
import {ValidationContext, ValidationContextProvider} from "$mp/containers/ProductController/ValidationContextProvider"
import {ProjectControllerContext, ProjectControllerProvider} from "$mp/containers/ProjectEditing/ProjectController"
import {ProjectStateContext, ProjectStateContextProvider} from "$mp/contexts/ProjectStateContext"
import usePreventNavigatingAway from "$shared/hooks/usePreventNavigatingAway"
import Layout from "$shared/components/Layout"
import {EditorNav} from "$mp/containers/ProjectEditing/EditorNav"
import styles from "$shared/components/Layout/layout.pcss"
import {MarketplaceHelmet} from "$shared/components/Helmet"
import {DetailsPageHeader} from "$shared/components/DetailsPageHeader"
import {ProjectEditor} from "$mp/containers/ProjectEditing/ProjectEditor"
import {LoadedProjectContextProvider, useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import PrestyledLoadingIndicator from "$shared/components/LoadingIndicator"
import {MarketplaceLoadingView} from "$mp/containers/ProjectPage/MarketplaceLoadingView"
import {getProjectTitleForEditor} from "$mp/containers/ProjectPage/utils"
import { InactiveProjectLinkTabs } from "../ProjectPage/utils"

const UnstyledEditProjectPage: FunctionComponent = () => {
    const {state: project} = useContext(ProjectStateContext)
    const { isAnyTouched, resetTouched } = useContext(ValidationContext)
    const {publishInProgress} = useContext(ProjectControllerContext)
    const {loadedProject} = useLoadedProject()
    usePreventNavigatingAway({
        isDirty: () => {
            return !isEqual(loadedProject, project) && isAnyTouched()
        },
    })
    const nonEditableSalePointChains = useMemo<number[]>(
        () => Object.values(loadedProject.salePoints).map((salePoint) => salePoint.chainId
        ), [loadedProject])

    useEffect(() => {
        resetTouched()
    }, [resetTouched])

    const pageTitle = useMemo<ReactNode>(() => {
        return getProjectTitleForEditor(project)
    }, [project])

    return <Layout
        nav={<EditorNav isNewProject={false} editedProductHasChanged={!isEqual(loadedProject, project)}/>}
        innerClassName={styles.greyInner}
    >
        <MarketplaceHelmet title={'Edit project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            rightComponent={<InactiveProjectLinkTabs />}
        />
        <LoadingIndicator loading={publishInProgress}/>
        <ProjectEditor nonEditableSalePointChains={nonEditableSalePointChains}/>
    </Layout>
}

const StyledEditProjectPage = styled(UnstyledEditProjectPage)`
    position: absolute;
    top: 0;
    height: 2px;
`

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    top: 2px;
`

const EditProjectInnerContainer: FunctionComponent = (props) => {
    const {loadedProject} = useLoadedProject()
    if (!loadedProject) {
        return <MarketplaceLoadingView />
    }
    return <ProjectStateContextProvider initState={loadedProject}>
        <ValidationContextProvider>
            <ProjectControllerProvider>
                <StyledEditProjectPage {...props}/>
            </ProjectControllerProvider>
        </ValidationContextProvider>
    </ProjectStateContextProvider>
}

const EditProjectContainer: FunctionComponent = (props) => {
    return <LoadedProjectContextProvider>
        <EditProjectInnerContainer {...props}/>
    </LoadedProjectContextProvider>
}

export default EditProjectContainer
