import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'
import '$mp/types/project-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { ProjectTypeEnum } from '$mp/utils/constants'
import useFailure from '$shared/hooks/useFailure'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { EditorNav2 } from '$mp/containers/EditProductPage/EditorNav2'
import { ProjectStateContext, ProjectStateContextProvider } from '$mp/contexts/ProjectStateContext'
import {
    ValidationContext2,
    ValidationContext2Provider
} from '$mp/containers/ProductController/ValidationContextProvider2'
import { ProjectEditor } from '$mp/containers/EditProductPage/ProjectEditor'
import styles from '$shared/components/Layout/layout.pcss'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import {
    ProjectControllerProvider
} from '$mp/containers/EditProductPage/ProjectControllerProvider'
import { useEditableProjectActions } from '../containers/ProductController/useEditableProjectActions'

type Props = {
    className?: string | null | undefined
}

const UnstyledNewProductPage = ({ className }: Props) => {
    // todo check and remove unused hooks
    const history = useHistory()
    const isMounted = useIsMounted()
    const fail = useFailure()
    const location = useLocation()
    const {state: project} = useContext(ProjectStateContext)
    const { type } = qs.parse(location.search)
    const { updateType } = useEditableProjectActions()
    const { isAnyTouched, resetTouched } = useContext(ValidationContext2)
    usePreventNavigatingAway('You have unsaved changes', isAnyTouched)

    useEffect(() => {
        const typeIsValid = Object.values(ProjectTypeEnum).includes(type as ProjectTypeEnum)
        updateType( typeIsValid ? type as ProjectTypeEnum : ProjectTypeEnum.OPEN_DATA)
    }, [type])

    useEffect(() => {
        resetTouched()
    }, [])

    const pageTitle = useMemo<ReactNode>(() => {
        let projectType: string
        switch (project.type) {
            case ProjectTypeEnum.OPEN_DATA:
                projectType = 'Open Data'
                break
            case ProjectTypeEnum.DATA_UNION:
                projectType = 'Data Union'
                break
            case ProjectTypeEnum.PAID_DATA:
                projectType = 'Paid Data'
                break
            default:
                projectType = 'Project'
                break
        }
        return <>{projectType} by <strong>[CREATOR NAME HERE]</strong></>
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

    return <Layout nav={<EditorNav2 isNewProject={true}/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={'Create a new project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            linkTabs={linkTabs}
        />
        <ProjectEditor/>
    </Layout>
}

const StyledNewProductPage = styled(UnstyledNewProductPage)`
    position: absolute;
    top: 0;
    height: 2px;
`

const NewProjectPageContainer = (props: Props) => {
    return <ProjectStateContextProvider>
        <ValidationContext2Provider>
            <ProjectControllerProvider>
                <StyledNewProductPage {...props}/>
            </ProjectControllerProvider>
        </ValidationContext2Provider>
    </ProjectStateContextProvider>
}
export default NewProjectPageContainer
