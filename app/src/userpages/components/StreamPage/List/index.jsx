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
import { getResourcePermissions } from '$userpages/modules/permission/actions'
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

const StreamTable = styled.div`
    @media (min-width: ${MD}px) {
        margin-top: 50px;
        border-top: 1px solid #CDCDCD;
    }

    @media (min-width: ${LG}px) {
        margin-top: 0;
        margin-bottom: auto;
        border-top: none;
    }
`

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    ${StreamTable}:last-child {
        margin-bottom: 4rem;
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

const Row = styled.div`
    display: grid;
    grid-row-gap: 2px;
    grid-column-gap: 1rem;
    border-bottom: 1px solid #CDCDCD;
    padding: 1.15rem 1.5rem;
    grid-template-columns: minmax(0, 1fr) 16px;
    align-items: center;
    line-height: 20px;

    @media (min-width: ${MD}px) {
        padding: 1.5rem;
        grid-template-columns: minmax(0,auto) minmax(136px,1fr) 16px;
    }

    @media (min-width: ${LG}px) {
        grid-template-columns: minmax(200px, 3fr) 3fr minmax(136px, 2fr) minmax(136px, 2fr) minmax(68px, 1fr) 32px;
        grid-row-gap: 0;
        padding: 1.25rem 0.75rem;
    }
`

const HeaderRow = styled(Row)`
    display: none;

    @media (min-width: ${LG}px) {
        display: grid;
        padding: 0.75rem;
        line-height: 14px;
    }
`

const TableRow = styled(Row)`
    cursor: pointer;

    &:hover,
    &:focus-within {
        background-color: #EFEFEF;

        .dropdown {
            visibility: visible;
        }
    }
`

const RowItem = styled.div`
    display: none;
    color: #525252;
`

const HeaderItem = styled(Translate)`
    display: block;
    font-family: var(--sans);
    font-size: 12px;
    letter-spacing: 0;
    color: #A3A3A3;
    font-weight: var(--medium);
`

const StatusHeaderItem = styled(HeaderItem)`
    text-align: center;
`

const StreamName = styled(RowItem)`
    display: block;
    font-weight: var(--medium);
    color: #323232;
    letter-spacing: 0;

    grid-row: 1;
    grid-column: 1;

    @media (min-width: ${LG}px) {
        font-size: 14px;
        grid-row: 1;
        grid-column: 1;
    }
`

const StreamDescription = styled(RowItem)`
    font-size: 12px;
    font-weight: var(--regular);

    @media (min-width: ${MD}px) {
        display: block;
        overflow-x: hidden;
        word-break: break-word;
        text-overflow: ellipsis;
        white-space: nowrap;
        grid-row: 2;
        grid-column: 1 / 3;
        max-width: calc(100% - 144px);
    }

    @media (min-width: ${LG}px) {
        grid-row: 1;
        grid-column: 2;
        font-size: 14px;
        max-width: none;
    }

    &:empty {
        &::after {
            content: ' ';
            white-space: pre;
        }
    }
`

const LastUpdated = styled(RowItem)`
    @media (min-width: ${LG}px) {
        display: block;
        grid-row: 1;
        grid-column: 3;
        text-align: left;
        font-size: 14px;
        color: inherit;
    }
`

const LastData = styled(RowItem)`
    display: block;
    color: #A3A3A3;
    font-size: 12px;
    overflow-x: hidden;
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: var(--regular);

    grid-row: 2;
    grid-column: 1;

    &:empty {
        &::after {
            content: ' ';
            white-space: pre;
        }
    }

    @media (min-width: ${MD}px) {
        grid-row: 1;
        grid-column: 2;
        margin-bottom: -4px;
    }

    @media (min-width: ${LG}px) {
        display: block;
        grid-row: 1;
        grid-column: 4;
        text-align: left;
        color: inherit;
        font-size: 14px;
        margin-bottom: 0;
    }
`

const Status = styled(RowItem)`
    display: block;
    grid-row: 1 / 3;
    grid-column: 2;
    padding-top: 0.5rem;
    position: relative;

    @media (min-width: ${MD}px) {
        grid-row: 1;
        grid-column: 3;
        padding-top: 0;
    }

    @media (min-width: ${LG}px) {
        grid-row: 1;
        grid-column: 5;
        text-align: center;
    }
`

const StreamActions = styled(RowItem)`
    @media (min-width: ${LG}px) {
        display: block;
        grid-row: 1;
        grid-column: 6;

        .dropdown {
            visibility: hidden;
        }

        .dropdown.show {
            visibility: visible;
        }
    }
`

const StyledStatusIcon = styled(StatusIcon)`
    && {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

const StreamTitle = styled.div`
    overflow-x: hidden;
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
`

type TargetStream = ?Stream

type TargetStreamSetter = [TargetStream, ((TargetStream => TargetStream) | TargetStream) => void]

function StreamPageSidebar({ stream }) {
    const sidebar = useContext(SidebarContext)
    const onClose = useCallback(() => {
        sidebar.close()
    }, [sidebar])

    return (
        <Sidebar
            isOpen={sidebar.isOpen()}
            onClose={onClose}
        >
            {sidebar.isOpen('share') && (
                <ShareSidebar
                    sidebarName="share"
                    resourceTitle={stream && stream.name}
                    resourceType="STREAM"
                    resourceId={stream && stream.id}
                />
            )}
        </Sidebar>
    )
}

const StreamList = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('stream')
        return [
            filters.RECENT,
            filters.NAME_ASC,
            filters.NAME_DESC,
        ]
    }, [])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
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
                <Popover
                    title={I18n.t('userpages.filter.sortBy')}
                    type="uppercase"
                    activeTitle
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    menuProps={{
                        right: true,
                    }}
                >
                    {sortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </Popover>
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
                        <StreamTable>
                            <HeaderRow>
                                <HeaderItem tag="div" value="userpages.streams.list.name" />
                                <HeaderItem tag="div" value="userpages.streams.list.description" />
                                <HeaderItem tag="div" value="userpages.streams.list.updated" />
                                <HeaderItem tag="div" value="userpages.streams.list.lastData" />
                                <StatusHeaderItem tag="div" value="userpages.streams.list.status" />
                                <RowItem />
                            </HeaderRow>
                            {streams.map((stream) => (
                                <TableRow
                                    key={stream.id}
                                    onClick={() => onStreamRowClick(stream.id)}
                                >
                                    <StreamName title={stream.name}>
                                        <StreamTitle>{stream.name}</StreamTitle>
                                    </StreamName>
                                    <StreamDescription title={stream.description}>
                                        {stream.description}
                                    </StreamDescription>
                                    <LastUpdated>
                                        {stream.lastUpdated && titleize(ago(new Date(stream.lastUpdated)))}
                                    </LastUpdated>
                                    <LastData>
                                        {stream.lastData && titleize(ago(new Date(stream.lastData)))}
                                    </LastData>
                                    <Status>
                                        <StyledStatusIcon status={stream.streamStatus} tooltip />
                                    </Status>
                                    <StreamActions
                                        onClick={(event) => event.stopPropagation()}
                                    >
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
                                    </StreamActions>
                                </TableRow>
                            ))}
                        </StreamTable>
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
