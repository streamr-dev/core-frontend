// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'

import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import type { Stream } from '$shared/flowtype/stream-types'

import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams, updateFilter } from '$userpages/modules/userPageStreams/actions'
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
import ShareDialog from '$userpages/components/ShareDialog'
import SnippetDialog from '$userpages/components/SnippetDialog/index'

const CreateStreamButton = () => (
    <Button id="streamlist-create-stream">
        <Link to={links.userpages.streamCreate}>
            <Translate value="userpages.streams.createStream" />
        </Link>
    </Button>
)

export type StateProps = {
    streams: Array<Stream>,
    fetching: boolean,
    filter: ?Filter,
}

export type DispatchProps = {
    getStreams: () => void,
    updateFilter: (filter: Filter) => void,
    showStream: (string) => void,
    copyToClipboard: (string) => void,
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
            >
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
                        resourceTitle={dialogTargetStream.name}
                        resourceId={dialogTargetStream.id}
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
                                                <DropdownActions.Item>
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
    streams: selectStreams(state),
    fetching: selectFetching(state),
    filter: selectFilter(state),
})

const mapDispatchToProps = (dispatch) => ({
    getStreams: () => dispatch(getStreams()),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
    showStream: (id) => dispatch(push(`${links.userpages.streamShow}/${id}`)),
    copyToClipboard: (text) => copy(text),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
