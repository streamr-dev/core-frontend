// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'

import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'

import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams, updateFilter, deleteStream } from '$userpages/modules/userPageStreams/actions'
import { selectStreams, selectFetching, selectFilter } from '$userpages/modules/userPageStreams/selectors'
import { getFilters } from '$userpages/utils/constants'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import NoStreamsView from './NoStreams'
import Layout from '$userpages/components/Layout'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectStreamPermissions } from '$userpages/modules/permission/selectors'
import type { Permission, ResourceId } from '$userpages/flowtype/permission-types'
import type { User } from '$shared/flowtype/user-types'
import { selectUserData } from '$shared/modules/user/selectors'
import ShareDialog from '$userpages/components/ShareDialog'
import SnippetDialog from '$userpages/components/SnippetDialog/index'
import { ProgrammingLanguages } from '$shared/utils/constants'

export const CreateStreamButton = () => (
    <Button color="primary" id="streamlist-create-stream">
        <Link to={links.userpages.streamCreate}>
            <Translate value="userpages.streams.createStream" />
        </Link>
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
}

export type DispatchProps = {
    getStreams: () => void,
    updateFilter: (filter: Filter) => void,
    showStream: (StreamId) => void,
    deleteStream: (StreamId) => void,
    copyToClipboard: (string) => void,
    getStreamPermissions: (id: StreamId) => void,
}

type Props = StateProps & DispatchProps

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.RECENT,
        filters.SHARED,
        filters.MINE,
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
        getStreams()
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getStreams } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getStreams()
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
            getStreams()
        }
    }

    confirmDeleteStream = async (stream: Stream) => {
        const confirmed = await confirmDialog({
            title: I18n.t('userpages.streams.delete.confirmTitle', {
                stream: stream.name,
            }),
            message: I18n.t('userpages.streams.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.streams.delete.confirmButton'),
                color: 'danger',
            },
            centerButtons: true,
        })

        if (confirmed) {
            this.props.deleteStream(stream.id)
        }
    }

    loadStreamPermissions = (id: StreamId) => {
        const { permissions, getStreamPermissions, fetchingPermissions } = this.props

        if (!fetchingPermissions && !permissions[id]) {
            getStreamPermissions(id)
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

    render() {
        const {
            fetching,
            streams,
            showStream,
            copyToClipboard,
            filter,
        } = this.props
        const { dialogTargetStream, activeDialog } = this.state

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
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
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
                <Helmet>
                    <title>{I18n.t('userpages.title.streams')}</title>
                </Helmet>
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
                        name={dialogTargetStream.name}
                        snippets={getSnippets(dialogTargetStream.id)}
                        onClose={this.onCloseDialog}
                    />
                )}
                <div className="container">
                    {!fetching && streams && streams.length <= 0 && (
                        <NoStreamsView />
                    )}
                    {streams && streams.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th><Translate value="userpages.streams.list.name" /></th>
                                    <th><Translate value="userpages.streams.list.description" /></th>
                                    <th><Translate value="userpages.streams.list.updated" /></th>
                                    <th><Translate value="userpages.streams.list.lastData" /></th>
                                    <th><Translate value="userpages.streams.list.status" /></th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {streams.map((stream) => (
                                    <tr key={stream.id}>
                                        <th>{stream.name}</th>
                                        <td title={stream.description}>{stream.description}</td>
                                        <td>{moment(stream.lastUpdated).fromNow()}</td>
                                        <td>-</td>
                                        <td><StatusIcon /></td>
                                        <td>
                                            <DropdownActions
                                                title={<Meatball alt={I18n.t('userpages.streams.actions')} />}
                                                noCaret
                                                onMenuToggle={(open) => {
                                                    if (open) {
                                                        this.loadStreamPermissions(stream.id)
                                                    }
                                                }}
                                            >
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.addToCanvas" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => showStream(stream.id)}>
                                                    <Translate value="userpages.streams.actions.editStream" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => copyToClipboard(stream.id)}>
                                                    <Translate value="userpages.streams.actions.copyId" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => this.onOpenSnippetDialog(stream)}>
                                                    <Translate value="userpages.streams.actions.copySnippet" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => this.onOpenShareDialog(stream)}>
                                                    <Translate value="userpages.streams.actions.share" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.refresh" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item
                                                    disabled={!this.hasWritePermission(stream.id)}
                                                    onClick={() => this.confirmDeleteStream(stream)}
                                                >
                                                    <Translate value="userpages.streams.actions.delete" />
                                                </DropdownActions.Item>
                                            </DropdownActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
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
})

const mapDispatchToProps = (dispatch) => ({
    getStreams: () => dispatch(getStreams()),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    showStream: (id: StreamId) => dispatch(push(`${links.userpages.streamShow}/${id}`)),
    deleteStream: (id: StreamId) => dispatch(deleteStream(id)),
    copyToClipboard: (text) => copy(text),
    getStreamPermissions: (id: StreamId) => dispatch(getResourcePermissions('STREAM', id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
