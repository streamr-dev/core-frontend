import React, { useContext, useEffect, useMemo } from 'react'
import type { Location } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'
import type { ProjectType } from '$mp/types/project-types'
import '$mp/types/project-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { projectTypes } from '$mp/utils/constants'
import useFailure from '$shared/hooks/useFailure'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { EditorNav2 } from '$mp/containers/EditProductPage/EditorNav2'
import { ProjectStateContext, ProjectStateContextProvider } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import {
    Context as ValidationContext,
    Provider as ValidationContextProvider
} from '$mp/containers/ProductController/ValidationContextProvider'
import { ProjectEditor } from '$mp/containers/EditProductPage/ProjectEditor'
import styles from '$shared/components/Layout/layout.pcss'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import routes from '$routes'
import useNewProductMode from '../containers/ProductController/useNewProductMode'

type Props = {
    className?: string | null | undefined
    location: Location
}

const sanitizedType = (type: string | null | undefined): ProjectType => projectTypes[(type || '').toUpperCase()] || projectTypes.NORMAL

const UnstyledNewProductPage = ({ className, location: { search } }: Props) => {
    const history = useHistory()
    const isMounted = useIsMounted()
    const fail = useFailure()
    const {state: project} = useContext(ProjectStateContext)
    const { dataUnionAddress, chainId } = useNewProductMode() // TODO check if it's still needed
    const { type, isPaid } = qs.parse(search)
    const typeString = (type != null && typeof type === "string") ? type : type[0]
    const sanitized = sanitizedType(typeString)
    const {updateType} = useEditableProjectActions()
    const { isAnyTouched, resetTouched, status } = useContext(ValidationContext)
    usePreventNavigatingAway('You have unsaved changes', isAnyTouched)
    useEffect(() => {
        if (!!sanitized) {
            updateType(sanitized)
        }
    }, [sanitized])

    useEffect(() => {
        resetTouched()
    }, [])

    const linkTabs = useMemo(() => [
        {
            label: 'Project Overview',
            href: window.location.href,
            disabled: false,
        }, {
            label: 'Connect',
            href: '',
            disabled: true,
        }, {
            label: 'Live Data',
            href: '',
            disabled: true,
        }], [])

    return <Layout nav={<EditorNav2/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={'Create a new project'}/>
        <DetailsPageHeader
            pageTitle={project.name || 'Create a project'}
            currentPageUrl={window.location.href}
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
    return <ValidationContextProvider>
        <ProjectStateContextProvider>
            <StyledNewProductPage {...props}/>
        </ProjectStateContextProvider>
    </ValidationContextProvider>
}
export default NewProjectPageContainer
