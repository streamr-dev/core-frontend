import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams } from '../../../modules/stream/actions'
import * as StreamDelete from '../Show/InfoView/StreamDeleteButton'
import Table from '../../Table'

const StreamDeleteButton = connect(null, StreamDelete.mapDispatchToProps)(StreamDelete.StreamDeleteButton)

export default connect((state) => ({
    streams: state.stream.byId,
}), {
    getStreams,
})(class StreamList extends Component {
    componentDidMount() {
        this.props.getStreams()
    }

    render() {
        return (
            <div className="container">
                <Button id="streamlist-create-stream">
                    <Link to={links.userpages.streamCreate}>Create Stream</Link>
                </Button>
                <span>
                    Streams
                </span>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Updated</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {!Object.values(this.props.streams).length && (
                            <Table.EmptyRow>
                                <td colSpan="5">No Streams</td>
                            </Table.EmptyRow>
                        )}
                        {Object.values(this.props.streams).map((stream) => (
                            <tr key={stream.id}>
                                <td>
                                    <Link to={`${links.userpages.streamShow}/${stream.id}`}>
                                        {stream.name}
                                    </Link>
                                </td>
                                <td>{stream.description}</td>
                                <td>{stream.feed.name}</td>
                                <td>{new Date(stream.lastUpdated).toLocaleString()}</td>
                                <td>
                                    <Button>Share</Button>
                                    <StreamDeleteButton stream={stream}>Delete</StreamDeleteButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
})
