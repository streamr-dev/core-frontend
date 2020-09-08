// @flow

import React, { Fragment, useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'

import routes from '$routes'
import {
    getStreams,
    deleteStream,
    getStreamStatus,
    cancelStreamStatusFetch,
    clearStreamsList,
} from '$userpages/modules/userPageStreams/actions'
import { selectStreams, selectFetching, selectHasMoreSearchResults } from '$userpages/modules/userPageStreams/selectors'
import { getFilters } from '$userpages/utils/constants'
import Popover from '$shared/components/Popover'
import StatusIcon from '$shared/components/StatusIcon'
import Layout from '$userpages/components/Layout'
import Search from '../../Header/Search'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions, resetResourcePermission } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectStreamPermissions } from '$userpages/modules/permission/selectors'
import { NotificationIcon } from '$shared/utils/constants'
import NoStreamsView from './NoStreams'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import Notification from '$shared/utils/Notification'
import LoadMore from '$mp/components/LoadMore'
import ListContainer from '$shared/components/Container/List'
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'
import Sidebar from '$shared/components/Sidebar'
import SidebarProvider, { SidebarContext } from '$shared/components/Sidebar/SidebarProvider'
import ShareSidebar from '$userpages/components/ShareSidebar'
import { ago } from '$shared/utils/time'
import { MD, LG } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import SnippetDialog from './SnippetDialog'
import { StreamList as StreamListComponent } from '$shared/components/List'

const DesktopOnlyButton = styled(Button)`
    && {
        display: none;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-flex;
        }
    }
`

export const CreateStreamButton = () => (
    <DesktopOnlyButton
        tag={Link}
        to={routes.streams.new()}
    >
        <Translate value="userpages.streams.createStream" />
    </DesktopOnlyButton>
)

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

const TabletPopover = styled(Popover)`
    @media (min-width: ${LG}px) {
        display: none;
    }
`

type TargetStream = ?Stream

type TargetStreamSetter = [TargetStream, ((TargetStream => TargetStream) | TargetStream) => void]

function StreamPageSidebar({ stream }) {
    const sidebar = useContext(SidebarContext)
    const dispatch = useDispatch()

    const streamId = stream && stream.id

    const onClose = useCallback(() => {
        sidebar.close()

        if (streamId) {
            dispatch(resetResourcePermission('STREAM', streamId))
        }
    }, [sidebar, dispatch, streamId])

    return (
        <Sidebar.WithErrorBoundary
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && stream.name}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                    onClose={onClose}
                />
            )}
        </Sidebar.WithErrorBoundary>
    )
}

const StreamList = () => {
    const filters = useMemo(() => getFilters('stream'), [])
    const allSortOptions = useMemo(() => ([
        filters.RECENT_DESC,
        filters.RECENT_ASC,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]), [filters])
    const dropdownSortOptions = useMemo(() => ([
        filters.RECENT_DESC,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]), [filters])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(allSortOptions)
    const [dialogTargetStream, setDialogTargetStream]: TargetStreamSetter = useState(null)
    const dispatch = useDispatch()
    const { copy } = useCopy()
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetching)
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectStreamPermissions)
    const hasMoreResults = useSelector(selectHasMoreSearchResults)
    const { api: snippetDialog } = useModal('userpages.streamSnippet')

    const sidebar = useContext(SidebarContext)

    useEffect(() => () => {
        cancelStreamStatusFetch()
        dispatch(clearStreamsList())
    }, [dispatch])

    useEffect(() => {
        dispatch(getStreams({
            replace: true,
            filter,
        }))
    }, [dispatch, filter])

    const confirmDeleteStream = useCallback(async (stream: Stream) => {
        const confirmed = await confirmDialog('stream', {
            title: I18n.t('userpages.streams.delete.confirmTitle'),
            message: I18n.t('userpages.streams.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.streams.delete.confirmButton'),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            dispatch(deleteStream(stream.id))
        }
    }, [dispatch])

    const onToggleStreamDropdown = useCallback((streamId: StreamId) => async (open: boolean) => {
        if (open && !fetchingPermissions && !permissions[streamId]) {
            try {
                await dispatch(getResourcePermissions('STREAM', streamId))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions])

    const canBeSharedByCurrentUser = useCallback((id: StreamId): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('stream_share')
    ), [fetchingPermissions, permissions])

    const canBeDeletedByCurrentUser = useCallback((id: StreamId): boolean => (
        !fetchingPermissions &&
        permissions[id] &&
        permissions[id].includes('stream_delete')
    ), [fetchingPermissions, permissions])

    const onOpenShareDialog = useCallback((stream: Stream) => {
        setDialogTargetStream(stream)
        sidebar.open('share')
    }, [sidebar])

    const onOpenSnippetDialog = useCallback(async (stream: Stream) => {
        await snippetDialog.open({
            streamId: stream.id,
        })
    }, [snippetDialog])

    const showStream = useCallback((id: StreamId) => (
        dispatch(push(routes.streams.show({
            id,
        })))
    ), [dispatch])

    const onStreamRowClick = useCallback((id: StreamId) => {
        showStream(id)
    }, [showStream])

    const onRefreshStatus = useCallback((id: StreamId) => {
        dispatch(getStreamStatus(id))
            .then(() => {
                Notification.push({
                    title: I18n.t('userpages.streams.actions.refreshSuccess'),
                    icon: NotificationIcon.CHECKMARK,
                })
            }, () => {
                Notification.push({
                    title: I18n.t('userpages.streams.actions.refreshError'),
                    icon: NotificationIcon.ERROR,
                })
            })
    }, [dispatch])

    const onCopyId = useCallback((id: StreamId) => {
        copy(id)

        Notification.push({
            title: I18n.t('userpages.streams.actions.idCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const [activeSort, setActiveSort] = useState(undefined)

    const onDropdownSort = useCallback((value) => {
        setActiveSort(value)
        setSort(value)
    }, [setSort])

    const onHeaderSortUpdate = useCallback((asc, desc) => {
        setActiveSort((prevFilter) => {
            let nextSort

            if (![asc, desc].includes(prevFilter)) {
                nextSort = asc
            } else if (prevFilter === asc) {
                nextSort = desc
            }

            setSort(nextSort || (defaultFilter && defaultFilter.id))
            return nextSort
        })
    }, [setActiveSort, setSort, defaultFilter])

    return (
        <Layout
            headerAdditionalComponent={<CreateStreamButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.streams.filterStreams')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <TabletPopover
                    title={I18n.t('userpages.filter.sortBy')}
                    type="uppercase"
                    activeTitle
                    onChange={onDropdownSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    menuProps={{
                        right: true,
                    }}
                >
                    {dropdownSortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </TabletPopover>
            }
            loading={fetching}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.streams')}`} />
            <StyledListContainer>
                {!fetching && streams && streams.length <= 0 && (
                    <NoStreamsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {streams && streams.length > 0 && (
                    <Fragment>
                        <StreamListComponent>
                            <StreamListComponent.Header>
                                <StreamListComponent.HeaderItem
                                    asc={filters.NAME_ASC.filter.id}
                                    desc={filters.NAME_DESC.filter.id}
                                    active={activeSort}
                                    onClick={onHeaderSortUpdate}
                                >
                                    <Translate value="userpages.streams.list.name" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem>
                                    <Translate value="userpages.streams.list.description" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem
                                    asc={filters.RECENT_ASC.filter.id}
                                    desc={filters.RECENT_DESC.filter.id}
                                    active={activeSort}
                                    onClick={onHeaderSortUpdate}
                                >
                                    <Translate value="userpages.streams.list.updated" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem>
                                    <Translate value="userpages.streams.list.lastData" />
                                </StreamListComponent.HeaderItem>
                                <StreamListComponent.HeaderItem center>
                                    <Translate value="userpages.streams.list.status" />
                                </StreamListComponent.HeaderItem>
                            </StreamListComponent.Header>
                            {streams.map((stream) => (
                                <StreamListComponent.Row
                                    key={stream.id}
                                    id={stream.id}
                                    onClick={() => onStreamRowClick(stream.id)}
                                >
                                    <StreamListComponent.Title
                                        description={stream.description}
                                        moreInfo={stream.lastData && titleize(ago(new Date(stream.lastData)))}
                                    >
                                        {stream.name}
                                    </StreamListComponent.Title>
                                    <StreamListComponent.Item truncate title={stream.description}>
                                        {stream.description}
                                    </StreamListComponent.Item>
                                    <StreamListComponent.Item>
                                        {stream.lastUpdated && titleize(ago(new Date(stream.lastUpdated)))}
                                    </StreamListComponent.Item>
                                    <StreamListComponent.Item>
                                        {stream.lastData && titleize(ago(new Date(stream.lastData)))}
                                    </StreamListComponent.Item>
                                    <StreamListComponent.Item>
                                        <StatusIcon status={stream.streamStatus} tooltip />
                                    </StreamListComponent.Item>
                                    <StreamListComponent.Actions>
                                        <Popover
                                            title={I18n.t('userpages.streams.actions.title')}
                                            type="meatball"
                                            noCaret
                                            onMenuToggle={onToggleStreamDropdown(stream.id)}
                                            menuProps={{
                                                right: true,
                                            }}
                                        >
                                            <Popover.Item onClick={() => showStream(stream.id)}>
                                                <Translate value="userpages.streams.actions.editStream" />
                                            </Popover.Item>
                                            <Popover.Item onClick={() => onCopyId(stream.id)}>
                                                <Translate value="userpages.streams.actions.copyId" />
                                            </Popover.Item>
                                            <Popover.Item onClick={() => onOpenSnippetDialog(stream)}>
                                                <Translate value="userpages.streams.actions.copySnippet" />
                                            </Popover.Item>
                                            <Popover.Item
                                                disabled={!canBeSharedByCurrentUser(stream.id)}
                                                onClick={() => onOpenShareDialog(stream)}
                                            >
                                                <Translate value="userpages.streams.actions.share" />
                                            </Popover.Item>
                                            <Popover.Item onClick={() => onRefreshStatus(stream.id)}>
                                                <Translate value="userpages.streams.actions.refresh" />
                                            </Popover.Item>
                                            <Popover.Item
                                                disabled={!canBeDeletedByCurrentUser(stream.id)}
                                                onClick={() => confirmDeleteStream(stream)}
                                            >
                                                <Translate value="userpages.streams.actions.delete" />
                                            </Popover.Item>
                                        </Popover>
                                    </StreamListComponent.Actions>
                                </StreamListComponent.Row>
                            ))}
                        </StreamListComponent>
                        <LoadMore
                            hasMoreSearchResults={!fetching && hasMoreResults}
                            onClick={() => dispatch(getStreams())}
                            preserveSpace
                        />
                    </Fragment>
                )}
            </StyledListContainer>
            <SnippetDialog />
            <StreamPageSidebar stream={dialogTargetStream} />
            <DocsShortcuts />
        </Layout>
    )
}

export default (props: any) => (
    <SidebarProvider>
        <StreamList {...props} />
    </SidebarProvider>
)
