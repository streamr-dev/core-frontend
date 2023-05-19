import React from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import {
    useDoesUserHaveAccess,
    useIsProjectBusy,
    useProject,
} from '$shared/stores/projectEditor'
import {
    ProjectPermission,
    useCurrentProjectAbility,
} from '$shared/stores/projectAbilities'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import PP, { ProjectPageContainer } from '$shared/components/ProjectPage'
import { WhiteBox } from '$shared/components/WhiteBox'
import { StreamConnect } from '$shared/components/StreamConnect'
import { StreamPreview } from '$shared/components/StreamPreview'
import Terms from '$mp/components/ProductPage/Terms'
import Streams from '$mp/containers/ProjectPage/Streams'
import ProjectHero from '$mp/containers/ProjectPage/Hero/ProjectHero2'
import { SalePoint } from '$shared/types'
import routes from '$routes'
import ProjectLinkTabs from './ProjectLinkTabs'
import AccessManifest from './AccessManifest'
import GetAccess from './GetAccess'

const PageTitleContainer = styled.div`
    align-items: center;
    display: flex;
`

const EditButton = styled(Button)`
    border-radius: 100%;
    height: 32px;
    margin-left: 10px;
    width: 32px;
`

const ProjectTitle = styled.span`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

const Separator = styled.span`
    white-space: pre-wrap;
`

function ProjectOverviewPage() {
    const {
        id,
        name,
        description,
        termsOfUse,
        imageUrl,
        streams,
        type,
        contact,
        salePoints = {},
    } = useProject()

    if (!id) {
        return null
    }

    return (
        <PP>
            <ProjectPageContainer>
                <ProjectHero
                    contact={contact}
                    description={description}
                    imageUrl={imageUrl || undefined}
                    name={name}
                />
                <AccessManifest
                    projectId={id}
                    projectType={type}
                    salePoints={Object.values(salePoints).filter(Boolean) as SalePoint[]}
                />
                <Streams streams={streams} />
                <Terms terms={termsOfUse} />
            </ProjectPageContainer>
        </PP>
    )
}

function ProjectConnectPage() {
    const hasAccess = useDoesUserHaveAccess()

    const { id, name, type, streams, salePoints = {} } = useProject()

    if (!id) {
        return null
    }

    return (
        <PP>
            <ProjectPageContainer>
                {hasAccess ? (
                    <WhiteBox>
                        <StreamConnect streams={streams} />
                    </WhiteBox>
                ) : (
                    <GetAccess
                        projectId={id}
                        projectName={name}
                        projectType={type}
                        salePoints={Object.values(salePoints) as SalePoint[]}
                    />
                )}
            </ProjectPageContainer>
        </PP>
    )
}

function ProjectLiveDataPage() {
    const hasAccess = useDoesUserHaveAccess()

    const { id, name, type, streams, salePoints = {} } = useProject()

    if (!id) {
        return null
    }

    return hasAccess ? (
        <StreamPreview streamsList={streams} />
    ) : (
        <PP>
            <ProjectPageContainer>
                <GetAccess
                    projectId={id}
                    projectName={name}
                    projectType={type}
                    salePoints={Object.values(salePoints) as SalePoint[]}
                />
            </ProjectPageContainer>
        </PP>
    )
}

export default function TabbedPage() {
    const { tab } = useParams<{ tab: 'overview' | 'connect' | 'live-data' }>()

    const { id, name, creator } = useProject()

    const busy = useIsProjectBusy()

    const canEdit = useCurrentProjectAbility(ProjectPermission.Edit)

    return (
        <Layout gray>
            <MarketplaceHelmet title={name} />
            <DetailsPageHeader
                backButtonLink={routes.projects.index()}
                pageTitle={
                    <PageTitleContainer>
                        <ProjectTitle>
                            {name}
                            {!!creator && (
                                <>
                                    <Separator> by </Separator>
                                    <strong>{creator}</strong>
                                </>
                            )}
                        </ProjectTitle>
                        {canEdit && (
                            <EditButton
                                tag={Link}
                                to={routes.projects.edit({ id })}
                                kind="secondary"
                                size="mini"
                            >
                                <SvgIcon name="pencilFull" />
                            </EditButton>
                        )}
                    </PageTitleContainer>
                }
                rightComponent={<ProjectLinkTabs projectId={id} />}
            />
            <LoadingIndicator detached loading={busy} />
            {tab === 'overview' && <ProjectOverviewPage />}
            {tab === 'connect' && <ProjectConnectPage />}
            {tab === 'live-data' && <ProjectLiveDataPage />}
        </Layout>
    )
}
