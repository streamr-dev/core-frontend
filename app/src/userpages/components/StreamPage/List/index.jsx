import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams } from '$userpages/modules/userPageStreams/actions'
import * as StreamDelete from '../Show/InfoView/StreamDeleteButton'
import { selectStreams } from '$userpages/modules/userPageStreams/selectors'
import Table from '$shared/components/Table'

const StreamDeleteButton = connect(null, StreamDelete.mapDispatchToProps)(StreamDelete.StreamDeleteButton)

export default connect((state) => ({
    streams: selectStreams(state),
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
                        {!Object.values(this.props.streams).length && (
                            <tr>
                                <td colSpan="5">No Streams</td>
                            </tr>
                        )}
                        {Object.values(this.props.streams).map((stream) => (
                            <tr key={stream.id}>
                                <th>{stream.name}</th>
                                <td title={stream.description}>{stream.description}</td>
                                <td>{new Date(stream.lastUpdated).toLocaleString()}</td>
                                <td>-</td>
                                <td>-</td>
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
