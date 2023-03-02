import React, {FunctionComponent, ReactNode, useContext, useEffect, useMemo} from "react"
import styled from "styled-components"
import {isEqual} from "lodash"
import {ValidationContext, ValidationContextProvider} from "$mp/containers/ProductController/ValidationContextProvider"
import {ProjectControllerProvider} from "$mp/containers/EditProductPage/ProjectController"
import {ProjectStateContext, ProjectStateContextProvider} from "$mp/contexts/ProjectStateContext"
import usePreventNavigatingAway from "$shared/hooks/usePreventNavigatingAway"
import Layout from "$shared/components/Layout"
import {EditorNav} from "$mp/containers/EditProductPage/EditorNav"
import styles from "$shared/components/Layout/layout.pcss"
import {MarketplaceHelmet} from "$shared/components/Helmet"
import {DetailsPageHeader} from "$shared/components/DetailsPageHeader"
import {ProjectEditor} from "$mp/containers/EditProductPage/ProjectEditor"
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {mapProjectTypeName} from "$mp/utils/project-mapper"
import PrestyledLoadingIndicator from "$shared/components/LoadingIndicator"

const UnstyledEditProjectPage: FunctionComponent = () => {
    const {state: project, updateState} = useContext(ProjectStateContext)
    const { isAnyTouched, resetTouched } = useContext(ValidationContext)
    usePreventNavigatingAway('You have unsaved changes', isAnyTouched)
    const {loadedProject} = useLoadedProject()
    const nonEditableSalePointChains = useMemo<number[]>(
        () => Object.values(loadedProject.salePoints).map((salePoint) => salePoint.chainId
        ), [loadedProject])

    useEffect(() => {
        resetTouched()
    }, [])

    const pageTitle = useMemo<ReactNode>(() => {
        return <>{mapProjectTypeName(project.type)} by <strong>[CREATOR NAME HERE]</strong></>
    }, [project])

    const linkTabs = useMemo(() => [
        {
            label: 'Project Overview',
            href: location.pathname,
            disabled: false,
        }, {
            label: 'Connect',
            href: '',
            disabled: true,
        }, {
            label: 'Live Data',
            href: '',
            disabled: true,
        }], [location])

    return <Layout
        nav={<EditorNav isNewProject={false} editedProductHasChanged={!isEqual(loadedProject, project)}/>}
        innerClassName={styles.greyInner}
    >
        <MarketplaceHelmet title={'Edit project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            linkTabs={linkTabs}
        />
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

const EditProjectContainer: FunctionComponent = (props) => {
    const {loadedProject} = useLoadedProject()
    if (!loadedProject) {
        return <LoadingIndicator loading={true}/>
    }
    return <ProjectStateContextProvider initState={loadedProject}>
        <ValidationContextProvider>
            <ProjectControllerProvider>
                <StyledEditProjectPage {...props}/>
            </ProjectControllerProvider>
        </ValidationContextProvider>
    </ProjectStateContextProvider>
}

export default EditProjectContainer
