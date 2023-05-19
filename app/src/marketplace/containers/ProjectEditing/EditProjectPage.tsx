import React, {FunctionComponent, ReactNode, useCallback, useContext, useEffect, useMemo} from "react"
import styled from "styled-components"
import {isEqual} from "lodash"
import {useHistory} from "react-router-dom"
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
import ProjectLinkTabs from '$app/src/pages/ProjectPage/ProjectLinkTabs'
import {ProjectPermission, useProjectAbility} from "$shared/stores/projectAbilities"
import getCoreConfig from "$app/src/getters/getCoreConfig"
import useIsMounted from "$shared/hooks/useIsMounted"
import { useWalletAccount } from "$shared/stores/wallet"
import routes from "$routes"

const UnstyledEditProjectPage: FunctionComponent = () => {
    const {state: project} = useContext(ProjectStateContext)
    const { isAnyTouched, resetTouched } = useContext(ValidationContext)
    const {publishInProgress} = useContext(ProjectControllerContext)
    const {loadedProject} = useLoadedProject()

    usePreventNavigatingAway({
        isDirty: useCallback(() => {
            if (publishInProgress) {
               return false
            }

            return !isEqual(loadedProject, project) && isAnyTouched()
        }, [publishInProgress, loadedProject, project, isAnyTouched]),
    })

    const nonEditableSalePointChains = useMemo<number[]>(
        () => Object.values(loadedProject.salePoints).map((salePoint) => salePoint.chainId
        ), [loadedProject])

    const isMounted = useIsMounted()
    const { chainId } = getCoreConfig().projectRegistry
    const canEdit = useProjectAbility(chainId, project?.id || undefined, useWalletAccount(), ProjectPermission.Edit)
    const history = useHistory()

    useEffect(() => {
        if (isMounted() && canEdit === false) {
            history.replace(
                routes.projects.overview({
                    id: project.id,
                }),
            )
        }
    }, [isMounted, canEdit, history, project.id])

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
            rightComponent={<ProjectLinkTabs />}
        />
        <LoadingIndicator detached loading={publishInProgress} />
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
