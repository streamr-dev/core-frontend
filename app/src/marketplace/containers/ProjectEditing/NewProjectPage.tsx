import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'
import '$mp/types/project-types'
import { ProjectTypeEnum } from '$mp/utils/constants'
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
import {mapProjectTypeName} from "$mp/utils/project-mapper"
import PrestyledLoadingIndicator from "$shared/components/LoadingIndicator"
import Tabs, { Tab } from '$shared/components/Tabs'
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
        const typeIsValid = Object.values(ProjectTypeEnum).includes(type as ProjectTypeEnum)
        updateType( typeIsValid ? type as ProjectTypeEnum : ProjectTypeEnum.OPEN_DATA)
    }, [type, updateType])

    useEffect(() => {
        resetTouched()
    }, [resetTouched])

    const pageTitle = useMemo<ReactNode>(() => {
        return !!project.creator && <>{mapProjectTypeName(project.type)} by <strong> {project.creator} </strong></>
    }, [project])

    return <Layout nav={<EditorNav isNewProject={true}/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={'Create a new project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            rightComponent={
                <Tabs>
                    <Tab id="overview" tag={Link} selected to={location.pathname}>Project Overview</Tab>
                    <Tab id="connect" disabled>Connect</Tab>
                    <Tab id="liveData" disabled>Live data</Tab>
                </Tabs>
            }
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
