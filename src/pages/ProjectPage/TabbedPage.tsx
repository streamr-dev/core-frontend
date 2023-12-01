import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
    useIsAccessibleByCurrentWallet,
    useIsProjectDraftBusy,
    useProject,
} from '~/stores/projectDraft'
import {
    ProjectPermission,
    useCurrentProjectAbility,
} from '~/shared/stores/projectAbilities'
import Layout from '~/components/Layout'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import PP, { ProjectPageContainer } from '~/shared/components/ProjectPage'
import { WhiteBox } from '~/shared/components/WhiteBox'
import { StreamConnect } from '~/shared/components/StreamConnect'
import { StreamPreview } from '~/shared/components/StreamPreview'
import Terms from '~/marketplace/components/ProductPage/Terms'
import Streams from '~/marketplace/containers/ProjectPage/Streams'
import ProjectHero from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2'
import { SalePoint } from '~/shared/types'
import routes from '~/routes'
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
    const project = useProject()

    if (!project) {
        return null
    }

    const {
        id,
        name,
        description,
        termsOfUse,
        imageUrl,
        streams,
        type,
        contact,
        salePoints,
    } = project

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
    const hasAccess = useIsAccessibleByCurrentWallet()

    const project = useProject()

    if (!project) {
        return null
    }

    const { id, name, type, streams, salePoints } = project

    if (!id) {
        return null
    }

    return (
        <PP>
            <ProjectPageContainer>
                {hasAccess ? (
                    <WhiteBox className={'with-padding'}>
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
    const hasAccess = useIsAccessibleByCurrentWallet()

    const project = useProject()

    if (!project) {
        return null
    }

    const { id, name, type, streams, salePoints } = project

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

interface Props {
    tab: 'overview' | 'connect' | 'live-data'
}

export default function TabbedPage({ tab }: Props) {
    const { id = undefined, name = '', creator = '' } = useProject() || {}

    const busy = useIsProjectDraftBusy()

    const canEdit = useCurrentProjectAbility(ProjectPermission.Edit)

    return (
        <Layout pageTitle={name}>
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
            <LoadingIndicator loading={busy} />
            {tab === 'overview' && <ProjectOverviewPage />}
            {tab === 'connect' && <ProjectConnectPage />}
            {tab === 'live-data' && <ProjectLiveDataPage />}
        </Layout>
    )
}
