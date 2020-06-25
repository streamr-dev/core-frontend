// @flow

import React, { Fragment, useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import MediaQuery from 'react-responsive'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'

import {
    SecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'

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
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import Layout from '$userpages/components/Layout'
import Search from '../../Header/Search'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectStreamPermissions } from '$userpages/modules/permission/selectors'
import type { Permission } from '$userpages/flowtype/permission-types'
import { selectUserData } from '$shared/modules/user/selectors'
import SnippetDialog from '$userpages/components/SnippetDialog/index'
import { NotificationIcon } from '$shared/utils/constants'
import NoStreamsView from './NoStreams'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import breakpoints from '$app/scripts/breakpoints'
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
import { subscribeSnippets } from '$utils/streamSnippets'

import styles from './streamsList.pcss'

const { lg } = breakpoints

export const CreateStreamButton = () => (
    <Button
        className={styles.createStreamButton}
        tag={Link}
        to={routes.streams.new()}
    >
        <Translate value="userpages.streams.createStream" />
    </Button>
)

const Dialogs = {
    SHARE: 'share',
    SNIPPET: 'snippet',
}

type TargetStream = ?Stream

type TargetStreamSetter = [TargetStream, ((TargetStream => TargetStream) | TargetStream) => void]

function StreamPageSidebar({ stream }) {
    const sidebar = useContext(SidebarContext)
    const onClose = useCallback(() => {
        sidebar.close()
    }, [sidebar])

    return (
        <Sidebar
            className={styles.ModuleSidebar}
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
    const [activeDialog, setActiveDialog] = useState(undefined)
    const dispatch = useDispatch()
    const { copy } = useCopy()
    const user = useSelector(selectUserData)
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetching)
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectStreamPermissions)
    const hasMoreResults = useSelector(selectHasMoreSearchResults)
    const [openedDropdownStreamId, setOpenedDropdownStreamId] = useState(undefined)

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
        setOpenedDropdownStreamId(open ? streamId : undefined)

        if (open && !fetchingPermissions && !permissions[streamId]) {
            try {
                await dispatch(getResourcePermissions('STREAM', streamId, false))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions])

    const canBeSharedByCurrentUser = useCallback((id: StreamId): boolean => (
        !fetchingPermissions &&
        !!user &&
        permissions[id] &&
        permissions[id].find((p: Permission) => p.user === user.username && p.operation === 'stream_share') !== undefined
    ), [fetchingPermissions, permissions, user])

    const canBeDeletedByCurrentUser = useCallback((id: StreamId): boolean => (
        !fetchingPermissions &&
        !!user &&
        permissions[id] &&
        permissions[id].find((p: Permission) => p.user === user.username && p.operation === 'stream_delete') !== undefined
    ), [fetchingPermissions, permissions, user])

    const onOpenShareDialog = useCallback((stream: Stream) => {
        setDialogTargetStream(stream)
        sidebar.open('share')
    }, [sidebar])

    const onCloseDialog = useCallback(() => {
        setDialogTargetStream(null)
        setActiveDialog(null)
    }, [])

    const onOpenSnippetDialog = useCallback((stream: Stream) => {
        setDialogTargetStream(stream)
        setActiveDialog(Dialogs.SNIPPET)
    }, [])

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
                <DropdownActions
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
                        <DropdownActions.ActiveTickItem key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </DropdownActions.ActiveTickItem>
                    ))}
                </DropdownActions>
            }
            loading={fetching}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.streams')}`} />
            {!!dialogTargetStream && activeDialog === Dialogs.SNIPPET && (
                <SnippetDialog
                    snippets={subscribeSnippets(dialogTargetStream)}
                    onClose={onCloseDialog}
                />
            )}
            <ListContainer className={styles.streamListTabletContainer}>
                {!fetching && streams && streams.length <= 0 && (
                    <NoStreamsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {streams && streams.length > 0 && (
                    <Fragment>
                        <MediaQuery minWidth={lg.min}>
                            <div className={cx(styles.streamsTable, {
                                [styles.streamsTableLoadingMore]: !!(fetching && hasMoreResults),
                            })}
                            >
                                <Table>
                                    <thead>
                                        <tr>
                                            <th><Translate value="userpages.streams.list.name" /></th>
                                            <th><Translate value="userpages.streams.list.description" /></th>
                                            <th><Translate value="userpages.streams.list.updated" /></th>
                                            <th><Translate value="userpages.streams.list.lastData" /></th>
                                            <th className={styles.statusColumn}><Translate value="userpages.streams.list.status" /></th>
                                            <th className={styles.menuColumn} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {streams.map((stream) => (
                                            <tr
                                                key={stream.id}
                                                className={styles.streamRow}
                                                onClick={() => onStreamRowClick(stream.id)}
                                            >
                                                <Table.Th noWrap title={stream.name}>
                                                    {stream.name}
                                                    <span title={getSecurityLevelTitle(stream)}>
                                                        <SecurityIcon
                                                            className={styles.SecurityIcon}
                                                            level={getSecurityLevel(stream)}
                                                            mode="selected"
                                                            hideBasic
                                                        />
                                                    </span>
                                                </Table.Th>
                                                <Table.Td noWrap title={stream.description}>{stream.description}</Table.Td>
                                                <Table.Td noWrap>
                                                    {stream.lastUpdated && ago(new Date(stream.lastUpdated))}
                                                </Table.Td>
                                                <Table.Td>
                                                    {stream.lastData && ago(new Date(stream.lastData))}
                                                </Table.Td>
                                                <Table.Td className={styles.statusColumn}>
                                                    <StatusIcon status={stream.streamStatus} tooltip />
                                                </Table.Td>
                                                <Table.Td
                                                    onClick={(event) => event.stopPropagation()}
                                                    className={styles.menuColumn}
                                                >
                                                    <DropdownActions
                                                        title={I18n.t('userpages.streams.actions.title')}
                                                        type="meatball"
                                                        noCaret
                                                        onMenuToggle={onToggleStreamDropdown(stream.id)}
                                                        menuProps={{
                                                            right: true,
                                                        }}
                                                        toggleProps={{
                                                            className: cx(styles.dropdownActions, {
                                                                [styles.dropdownActionsOpen]: openedDropdownStreamId === stream.id,
                                                            }),
                                                        }}
                                                    >
                                                        <DropdownActions.Item onClick={() => showStream(stream.id)}>
                                                            <Translate value="userpages.streams.actions.editStream" />
                                                        </DropdownActions.Item>
                                                        <DropdownActions.Item onClick={() => onCopyId(stream.id)}>
                                                            <Translate value="userpages.streams.actions.copyId" />
                                                        </DropdownActions.Item>
                                                        <DropdownActions.Item onClick={() => onOpenSnippetDialog(stream)}>
                                                            <Translate value="userpages.streams.actions.copySnippet" />
                                                        </DropdownActions.Item>
                                                        <DropdownActions.Item
                                                            disabled={!canBeSharedByCurrentUser(stream.id)}
                                                            onClick={() => onOpenShareDialog(stream)}
                                                        >
                                                            <Translate value="userpages.streams.actions.share" />
                                                        </DropdownActions.Item>
                                                        <DropdownActions.Item onClick={() => onRefreshStatus(stream.id)}>
                                                            <Translate value="userpages.streams.actions.refresh" />
                                                        </DropdownActions.Item>
                                                        <DropdownActions.Item
                                                            disabled={!canBeDeletedByCurrentUser(stream.id)}
                                                            onClick={() => confirmDeleteStream(stream)}
                                                        >
                                                            <Translate value="userpages.streams.actions.delete" />
                                                        </DropdownActions.Item>
                                                    </DropdownActions>
                                                </Table.Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <LoadMore
                                    hasMoreSearchResults={!fetching && hasMoreResults}
                                    onClick={() => dispatch(getStreams())}
                                />
                            </div>
                        </MediaQuery>
                        <MediaQuery maxWidth={lg.min}>
                            <div className={cx(styles.streamsTable, {
                                [styles.streamsTableLoadingMore]: !!(fetching && hasMoreResults),
                            })}
                            >
                                <Table>
                                    <tbody>
                                        {streams.map((stream) => (
                                            <tr
                                                key={stream.id}
                                                className={styles.streamRow}
                                                onClick={() => onStreamRowClick(stream.id)}
                                            >
                                                <Table.Td className={styles.tabletStreamRow}>
                                                    <div className={styles.tabletStreamRowContainer}>
                                                        <div>
                                                            <span className={styles.tabletStreamName} title={stream.name}>
                                                                {stream.name}
                                                                <span title={getSecurityLevelTitle(stream)}>
                                                                    <SecurityIcon
                                                                        className={styles.SecurityIcon}
                                                                        level={getSecurityLevel(stream)}
                                                                        mode="selected"
                                                                        hideBasic
                                                                    />
                                                                </span>
                                                            </span>
                                                            <span className={styles.tabletStreamDescription}>
                                                                {stream.description}
                                                            </span>
                                                            <span className={styles.lastUpdatedStreamMobile}>
                                                                {stream.lastUpdated && ago(new Date(stream.lastUpdated))}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className={styles.lastUpdatedStreamTablet}>
                                                                {stream.lastUpdated && ago(new Date(stream.lastUpdated))}
                                                            </span>
                                                            <StatusIcon
                                                                tooltip
                                                                status={stream.streamStatus}
                                                                className={styles.tabletStatusStreamIcon}
                                                            />
                                                        </div>
                                                    </div>
                                                </Table.Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <LoadMore
                                    hasMoreSearchResults={!fetching && hasMoreResults}
                                    onClick={() => dispatch(getStreams())}
                                />
                            </div>
                        </MediaQuery>
                    </Fragment>
                )}
            </ListContainer>
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
