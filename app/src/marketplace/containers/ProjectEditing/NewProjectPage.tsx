import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'
import '$mp/types/project-types'
import { ProjectType } from '$shared/types'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { EditorNav } from '$mp/containers/ProjectEditing/EditorNav'
import { ProjectStateContext, ProjectStateContextProvider } from '$mp/contexts/ProjectStateContext'
import {
    ValidationContext,
    ValidationContextProvider
} from '$mp/containers/ProductController/ValidationContextProvider'
import { ProjectEditor } from '$mp/containers/ProjectEditing/ProjectEditor'
import styles from '$shared/components/Layout/layout.pcss'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import {
    ProjectControllerContext,
    ProjectControllerProvider
} from '$mp/containers/ProjectEditing/ProjectController'
import PrestyledLoadingIndicator from "$shared/components/LoadingIndicator"
import {getProjectTitleForEditor} from "$mp/containers/ProjectPage/utils"
import ProjectLinkTabs from '$app/src/pages/ProjectPage/ProjectLinkTabs'
import { useEditableProjectActions } from '../ProductController/useEditableProjectActions'

type Props = {
    className?: string | null | undefined
}

const UnstyledNewProjectPage = ({ className }: Props) => {
    const location = useLocation()
    const {state: project} = useContext(ProjectStateContext)
    const {publishInProgress} = useContext(ProjectControllerContext)
    const { type } = qs.parse(location.search)
    const { updateType } = useEditableProjectActions()
    const { isAnyTouched, resetTouched } = useContext(ValidationContext)
    usePreventNavigatingAway({
        isDirty: isAnyTouched,
    })

    useEffect(() => {
        const typeIsValid = Object.values(ProjectType).includes(type as ProjectType)
        updateType( typeIsValid ? type as ProjectType : ProjectType.OpenData)
    }, [type, updateType])

    useEffect(() => {
        resetTouched()
    }, [resetTouched])

    const pageTitle = useMemo<ReactNode>(() => {
        return getProjectTitleForEditor(project)
    }, [project])

    return <Layout nav={<EditorNav isNewProject={true}/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={'Create a new project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            rightComponent={<ProjectLinkTabs />}
        />
        <LoadingIndicator loading={publishInProgress}/>
        <ProjectEditor/>
    </Layout>
}

const StyledNewProjectPage = styled(UnstyledNewProjectPage)`
    position: absolute;
    top: 0;
    height: 2px;
`

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    top: 2px;
`

const NewProjectPageContainer = (props: Props) => {
    return <ProjectStateContextProvider>
        <ValidationContextProvider>
            <ProjectControllerProvider>
                <StyledNewProjectPage {...props}/>
            </ProjectControllerProvider>
        </ValidationContextProvider>
    </ProjectStateContextProvider>
}
export default NewProjectPageContainer
