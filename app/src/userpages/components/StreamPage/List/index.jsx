import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'

import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams } from '$userpages/modules/userPageStreams/actions'
// import * as StreamDelete from '../Show/InfoView/StreamDeleteButton'
import { selectStreams, selectFetching } from '$userpages/modules/userPageStreams/selectors'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import NoStreamsView from './NoStreams'

// const StreamDeleteButton = connect(null, StreamDelete.mapDispatchToProps)(StreamDelete.StreamDeleteButton)

class StreamList extends Component {
    componentDidMount() {
        this.props.getStreams()
    }

    render() {
        const { fetching, streams, showStream, copyToClipboard } = this.props

        return (
            <div className="container">
                <Button id="streamlist-create-stream">
                    <Link to={links.userpages.streamCreate}>Create Stream</Link>
                </Button>
                {!fetching && streams && streams.length <= 0 && (
                    <NoStreamsView />
                )}
                {!fetching && streams && streams.length > 0 && (
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Updated</th>
                                <th>Last Data</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {!Object.values(streams).length && (
                                <tr>
                                    <td colSpan="5">No Streams</td>
                                </tr>
                            )}
                            {Object.values(streams).map((stream) => (
                                <tr key={stream.id}>
                                    <th>{stream.name}</th>
                                    <td title={stream.description}>{stream.description}</td>
                                    <td>{moment(stream.lastUpdated).fromNow()}</td>
                                    <td>-</td>
                                    <td><StatusIcon /></td>
                                    <td>
                                        <DropdownActions
                                            title={<Meatball alt="Select" />}
                                            noCaret
                                        >
                                            <DropdownActions.Item>
                                                Add to canvas
                                            </DropdownActions.Item>
                                            <DropdownActions.Item onClick={() => showStream(stream.id)}>
                                                Edit stream
                                            </DropdownActions.Item>
                                            <DropdownActions.Item onClick={() => copyToClipboard(stream.id)}>
                                                Copy ID
                                            </DropdownActions.Item>
                                            <DropdownActions.Item>Copy Snippet</DropdownActions.Item>
                                            <DropdownActions.Item>Share</DropdownActions.Item>
                                            <DropdownActions.Item>Refresh</DropdownActions.Item>
                                            <DropdownActions.Item>Delete</DropdownActions.Item>
                                        </DropdownActions>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    streams: selectStreams(state),
    fetching: selectFetching(state),
})

const mapDispatchToProps = (dispatch) => ({
    getStreams: () => dispatch(getStreams()),
    showStream: (id) => dispatch(push(`${links.userpages.streamShow}/${id}`)),
    copyToClipboard: (text) => copy(text),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
