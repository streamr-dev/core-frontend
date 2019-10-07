// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Button } from 'reactstrap'
import MediaQuery from 'react-responsive'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'

import {
    SecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Show/SecurityView'

import links from '$shared/../links'
import {
    getStreams,
    updateFilter,
    deleteStream,
    getStreamStatus,
    cancelStreamStatusFetch,
    clearStreamsList,
} from '$userpages/modules/userPageStreams/actions'
import { selectStreams, selectFetching, selectFilter, selectHasMoreSearchResults } from '$userpages/modules/userPageStreams/selectors'
import { getFilters } from '$userpages/utils/constants'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import Layout from '$userpages/components/Layout'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectStreamPermissions } from '$userpages/modules/permission/selectors'
import type { Permission, ResourceId } from '$userpages/flowtype/permission-types'
import type { User } from '$shared/flowtype/user-types'
import { selectUserData } from '$shared/modules/user/selectors'
import ShareDialog from '$userpages/components/ShareDialog'
import SnippetDialog from '$userpages/components/SnippetDialog/index'
import { ProgrammingLanguages, NotificationIcon } from '$shared/utils/constants'
import NoStreamsView from './NoStreams'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import breakpoints from '$app/scripts/breakpoints'
import Notification from '$shared/utils/Notification'
import LoadMore from '$mp/components/LoadMore'
import ListContainer from '$shared/components/Container/List'

import styles from './streamsList.pcss'

const { lg } = breakpoints

export const CreateStreamButton = () => (
    <Button
        color="primary"
        className={styles.createStreamButton}
        tag={Link}
        to={links.userpages.streamCreate}
    >
        <Translate value="userpages.streams.createStream" />
    </Button>
)

export type StateProps = {
    user: ?User,
    streams: Array<Stream>,
    fetching: boolean,
    filter: ?Filter,
    fetchingPermissions: boolean,
    permissions: {
        [ResourceId]: Array<Permission>,
    },
    hasMoreResults: boolean,
}

export type DispatchProps = {
    getStreams: (replace?: boolean) => void,
    clearStreamsList: () => void,
    updateFilter: (filter: Filter) => void,
    showStream: (StreamId) => void,
    deleteStream: (StreamId) => void,
    copyToClipboard: (string) => void,
    getStreamPermissions: (id: StreamId) => void,
    refreshStreamStatus: (id: StreamId) => Promise<void>,
    cancelStreamStatusFetch: () => void,
}

type Props = StateProps & DispatchProps

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.RECENT,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]
}

const Dialogs = {
    SHARE: 'share',
    SNIPPET: 'snippet',
}

type State = {
    dialogTargetStream: ?Stream,
    activeDialog?: $Values<typeof Dialogs> | null,
}

const getSnippets = (streamId: StreamId) => ({
    // $FlowFixMe It's alright but Flow doesn't get it
    [ProgrammingLanguages.JAVASCRIPT]: String.raw`const StreamrClient = require('streamr-client')

const streamr = new StreamrClient({
    auth: {
        apiKey: 'YOUR-API-KEY',
    },
})

// Subscribe to a stream
streamr.subscribe({
    stream: '${streamId}'
},
(message, metadata) => {
    // Do something with the message here!
    console.log(message)
}`,
    // $FlowFixMe
    [ProgrammingLanguages.JAVA]: String.raw`StreamrClient client = new StreamrClient();
Stream stream = client.getStream("${streamId}");

Subscription sub = client.subscribe(stream, new MessageHandler() {
    @Override
    void onMessage(Subscription s, StreamMessage message) {
        // Here you can react to the latest message
        System.out.println(message.getPayload().toString());
    }
});`,
})

class StreamList extends Component<Props, State> {
    defaultFilter = getSortOptions()[0].filter

    state = {
        dialogTargetStream: undefined,
        activeDialog: undefined,
    }

    componentDidMount() {
        const { filter, updateFilter, getStreams } = this.props

        // Set default filter if not selected
        if (!filter) {
            updateFilter(this.defaultFilter)
        }
        getStreams(true)
    }

    componentWillUnmount() {
        this.props.cancelStreamStatusFetch()
        this.props.clearStreamsList()
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getStreams } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getStreams(true)
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter, getStreams } = this.props
        const sortOption = getSortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                search: filter && filter.search,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
            getStreams(true)
        }
    }

    resetFilter = () => {
        const { updateFilter, getStreams } = this.props
        updateFilter({
            ...this.defaultFilter,
            search: '',
        })
        getStreams(true)
    }

    confirmDeleteStream = async (stream: Stream) => {
        const confirmed = await confirmDialog('stream', {
            title: I18n.t('userpages.streams.delete.confirmTitle'),
            message: I18n.t('userpages.streams.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.streams.delete.confirmButton'),
                color: 'danger',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            this.props.deleteStream(stream.id)
        }
    }

    hasWritePermission = (id: StreamId) => {
        const { fetchingPermissions, permissions, user } = this.props

        return (
            !fetchingPermissions &&
            !!user &&
            permissions[id] &&
            permissions[id].find((p: Permission) => p.user === user.username && p.operation === 'write') !== undefined
        )
    }

    onOpenShareDialog = (stream: Stream) => {
        this.setState({
            dialogTargetStream: stream,
            activeDialog: Dialogs.SHARE,
        })
    }

    onCloseDialog = () => {
        this.setState({
            dialogTargetStream: null,
            activeDialog: null,
        })
    }

    onOpenSnippetDialog = (stream: Stream) => {
        this.setState({
            dialogTargetStream: stream,
            activeDialog: Dialogs.SNIPPET,
        })
    }

    onStreamRowClick = (id: StreamId) => {
        this.props.showStream(id)
    }

    onRefreshStatus = (id: StreamId) => {
        this.props.refreshStreamStatus(id)
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
    }

    onCopyId = (id: StreamId) => {
        this.props.copyToClipboard(id)

        Notification.push({
            title: I18n.t('userpages.streams.actions.idCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }

    render() {
        const {
            fetching,
            streams,
            showStream,
            filter,
            hasMoreResults,
            getStreams,
        } = this.props
        const timezone = moment.tz.guess()
        const { dialogTargetStream, activeDialog } = this.state
        const nowTime = moment.tz(Date.now(), timezone)

        return (
            <Layout
                headerAdditionalComponent={<CreateStreamButton />}
                headerSearchComponent={
                    <Search
                        placeholder={I18n.t('userpages.streams.filterStreams')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
                    />
                }
                headerFilterComponent={
                    <Dropdown
                        title={I18n.t('userpages.filter.sortBy')}
                        onChange={this.onSortChange}
                        selectedItem={(filter && filter.id) || this.defaultFilter.id}
                    >
                        {getSortOptions().map((s) => (
                            <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                {s.displayName}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                }
                loading={fetching}
            >
                <Helmet title={`Streamr Core | ${I18n.t('userpages.title.streams')}`} />
                {!!dialogTargetStream && activeDialog === Dialogs.SHARE && (
                    <ShareDialog
                        resourceTitle={dialogTargetStream.name}
                        resourceType="STREAM"
                        resourceId={dialogTargetStream.id}
                        onClose={this.onCloseDialog}
                    />
                )}
                {!!dialogTargetStream && activeDialog === Dialogs.SNIPPET && (
                    <SnippetDialog
                        snippets={getSnippets(dialogTargetStream.id)}
                        onClose={this.onCloseDialog}
                    />
                )}
                <ListContainer className={styles.streamListTabletContainer}>
                    {!fetching && streams && streams.length <= 0 && (
                        <NoStreamsView
                            hasFilter={!!filter && (!!filter.search || !!filter.key)}
                            filter={filter}
                            onResetFilter={this.resetFilter}
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
                                                    onClick={() => this.onStreamRowClick(stream.id)}
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
                                                        {stream.lastUpdated && (
                                                            moment.min(moment.tz(stream.lastUpdated, timezone), nowTime).fromNow()
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {stream.lastData && (
                                                            moment.min(moment.tz(stream.lastData, timezone), nowTime).fromNow()
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td className={styles.statusColumn}>
                                                        <StatusIcon status={stream.streamStatus} />
                                                    </Table.Td>
                                                    <Table.Td
                                                        onClick={(event) => event.stopPropagation()}
                                                        className={styles.menuColumn}
                                                    >
                                                        <DropdownActions
                                                            title={<Meatball alt={I18n.t('userpages.streams.actions')} />}
                                                            noCaret
                                                            menuProps={{
                                                                modifiers: {
                                                                    offset: {
                                                                        // Make menu aligned to the right.
                                                                        // See https://popper.js.org/popper-documentation.html#modifiers..offset
                                                                        offset: '-100%p + 100%',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <DropdownActions.Item onClick={() => showStream(stream.id)}>
                                                                <Translate value="userpages.streams.actions.editStream" />
                                                            </DropdownActions.Item>
                                                            <DropdownActions.Item onClick={() => this.onCopyId(stream.id)}>
                                                                <Translate value="userpages.streams.actions.copyId" />
                                                            </DropdownActions.Item>
                                                            <DropdownActions.Item onClick={() => this.onOpenSnippetDialog(stream)}>
                                                                <Translate value="userpages.streams.actions.copySnippet" />
                                                            </DropdownActions.Item>
                                                            <DropdownActions.Item
                                                                onClick={() => this.onOpenShareDialog(stream)}
                                                            >
                                                                <Translate value="userpages.streams.actions.share" />
                                                            </DropdownActions.Item>
                                                            <DropdownActions.Item onClick={() => this.onRefreshStatus(stream.id)}>
                                                                <Translate value="userpages.streams.actions.refresh" />
                                                            </DropdownActions.Item>
                                                            <DropdownActions.Item
                                                                onClick={() => this.confirmDeleteStream(stream)}
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
                                        onClick={() => getStreams()}
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
                                                    onClick={() => this.onStreamRowClick(stream.id)}
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
                                                                    {stream.lastUpdated && (
                                                                        moment.min(moment.tz(stream.lastUpdated, timezone), nowTime).fromNow()
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className={styles.lastUpdatedStreamTablet}>
                                                                    {stream.lastUpdated && (
                                                                        moment.min(moment.tz(stream.lastUpdated, timezone), nowTime).fromNow()
                                                                    )}
                                                                </span>
                                                                <StatusIcon status={stream.streamStatus} className={styles.tabletStatusStreamIcon} />
                                                            </div>
                                                        </div>
                                                    </Table.Td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <LoadMore
                                        hasMoreSearchResults={!fetching && hasMoreResults}
                                        onClick={() => getStreams()}
                                    />
                                </div>
                            </MediaQuery>
                        </Fragment>
                    )}
                </ListContainer>
                <DocsShortcuts />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    user: selectUserData(state),
    streams: selectStreams(state),
    fetching: selectFetching(state),
    filter: selectFilter(state),
    fetchingPermissions: selectFetchingPermissions(state),
    permissions: selectStreamPermissions(state),
    hasMoreResults: selectHasMoreSearchResults(state),
})

const mapDispatchToProps = (dispatch) => ({
    clearStreamsList: () => dispatch(clearStreamsList()),
    getStreams: (replace: boolean = false) => dispatch(getStreams(replace)),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    showStream: (id: StreamId) => dispatch(push(`${links.userpages.streamShow}/${id}`)),
    deleteStream: (id: StreamId) => dispatch(deleteStream(id)),
    copyToClipboard: (text) => copy(text),
    getStreamPermissions: (id: StreamId) => dispatch(getResourcePermissions('STREAM', id)),
    refreshStreamStatus: (id: StreamId) => dispatch(getStreamStatus(id)),
    cancelStreamStatusFetch,
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
