import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Link, Navigate, Outlet, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import ColoredBox from '~/components/ColoredBox'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import { QueriedStreamsTable } from '~/components/QueriedStreamsTable'
import { TermsOfUse } from '~/components/TermsOfUse'
import { getParsedProjectById } from '~/getters/hub'
import { StreamsOrderBy, useStreamsQuery, useStreamsStatsQuery } from '~/hooks/streams'
import { useTableOrder } from '~/hooks/useTableOrder'
import ProjectHero from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2'
import NotFoundPage from '~/pages/NotFoundPage'
import { getEmptyParsedProject } from '~/parsers/ProjectParser'
import routes from '~/routes'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import Segment from '~/shared/components/Segment'
import { StreamConnect } from '~/shared/components/StreamConnect'
import { StreamPreview } from '~/shared/components/StreamPreview'
import SvgIcon from '~/shared/components/SvgIcon'
import { useCurrentChainId } from '~/shared/stores/chain'
import {
    ProjectPermission,
    useCurrentProjectAbility,
} from '~/shared/stores/projectAbilities'
import { ProjectType, SalePoint } from '~/shared/types'
import {
    ProjectDraftContext,
    preselectSalePoint,
    useInitProjectDraft,
    useIsAccessibleByCurrentWallet,
    useIsProjectDraftBusy,
    useProject,
} from '~/stores/projectDraft'
import { isProjectType } from '~/utils'
import { AccessManifest } from './AccessManifest'
import GetAccess from './GetAccess'
import ProjectEditorPage from './ProjectEditorPage'
import ProjectLinkTabs from './ProjectLinkTabs'

export function NewProjectPage() {
    const type = useSearchParams()[0].get('type')

    const projectType = isProjectType(type) ? type : ProjectType.OpenData

    const project = useMemo(() => {
        const project = getEmptyParsedProject({
            type: projectType,
        })

        preselectSalePoint(project)

        return project
    }, [projectType])

    const draftId = useInitProjectDraft(project)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            <ProjectEditorPage />
        </ProjectDraftContext.Provider>
    )
}

export function ExistingProjectPageWrap() {
    const { id: projectId } = useParams<{ id: string }>()

    const chainId = useCurrentChainId()

    const query = useQuery({
        queryKey: ['ExistingProjectPageWrap.query', chainId, projectId?.toLowerCase()],
        queryFn: async () => {
            if (!projectId) {
                return null
            }

            const result = await getParsedProjectById(chainId, projectId)

            if (!result) {
                throw new Error('Project could not be found or is invalid')
            }

            return result
        },
        staleTime: Infinity,
        cacheTime: 0,
    })

    const { data: project = null } = query

    const isLoading = !project && (query.isLoading || query.isFetching)

    const draftId = useInitProjectDraft(isLoading ? undefined : project)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            {query.isError ? <NotFoundPage /> : <Outlet />}
        </ProjectDraftContext.Provider>
    )
}

export function ProjectOverviewPage() {
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

    const [firstSalePoint = undefined, ...otherSalePoints] = Object.values(
        salePoints,
    ).filter((salePoint) => salePoint?.enabled) as SalePoint[]

    return (
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    <ProjectHero
                        contact={contact}
                        description={description}
                        imageUrl={imageUrl || undefined}
                        name={name}
                    />
                </Segment>
                {firstSalePoint && (
                    <Segment>
                        <ColoredBox>
                            <Pad>
                                <AccessManifest
                                    projectId={id}
                                    projectType={type}
                                    firstSalePoint={firstSalePoint}
                                    otherSalePoints={otherSalePoints}
                                />
                            </Pad>
                        </ColoredBox>
                    </Segment>
                )}
                <NetworkPageSegment title="Streams">
                    <StreamTable streamIds={streams} />
                </NetworkPageSegment>
                <NetworkPageSegment title="Terms and conditions">
                    <Pad>
                        <TermsOfUse {...termsOfUse} />
                    </Pad>
                </NetworkPageSegment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectConnectPage() {
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
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    {hasAccess ? (
                        <ColoredBox>
                            <Pad>
                                <StreamConnect streams={streams} />
                            </Pad>
                        </ColoredBox>
                    ) : (
                        <GetAccess
                            projectId={id}
                            projectName={name}
                            projectType={type}
                            salePoints={
                                Object.values(salePoints).filter(
                                    (salePoint) => salePoint?.enabled,
                                ) as SalePoint[]
                            }
                        />
                    )}
                </Segment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectLiveDataPage() {
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
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    <GetAccess
                        projectId={id}
                        projectName={name}
                        projectType={type}
                        salePoints={
                            Object.values(salePoints).filter(
                                (salePoint) => salePoint?.enabled,
                            ) as SalePoint[]
                        }
                    />
                </Segment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectTabbedPage() {
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
                                as={Link}
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
            <Outlet />
        </Layout>
    )
}

export function ProjectIndexRedirect() {
    const { id = '' } = useParams<{ id: string }>()

    return (
        <Navigate
            to={routes.projects.overview({
                id: encodeURIComponent(id),
            })}
            replace
        />
    )
}

function StreamTable({ streamIds }: { streamIds: string[] }) {
    const {
        orderBy = 'mps',
        orderDirection = 'desc',
        setOrder,
    } = useTableOrder<StreamsOrderBy>()

    const streamsStatsQuery = useStreamsStatsQuery()

    const streamsQuery = useStreamsQuery({
        onBatch({ streamIds, source }) {
            streamsStatsQuery.fetchNextPage({
                pageParam: {
                    streamIds,
                    useIndexer: source !== 'indexer',
                },
            })
        },
        orderBy,
        orderDirection,
        streamIds,
    })

    return (
        <QueriedStreamsTable
            onOrderChange={setOrder}
            orderBy={orderBy}
            orderDirection={orderDirection}
            query={streamsQuery}
            statsQuery={streamsStatsQuery}
        />
    )
}

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
