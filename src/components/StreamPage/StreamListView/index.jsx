import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Panel } from 'react-bootstrap'
import links from '../../../links'
import { getStreams } from '../../../modules/stream/actions'
import * as StreamDelete from '../StreamShowView/InfoView/StreamDeleteButton'

import styles from './streamList.pcss'

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
                <Button>
                    <Link to={links.streamCreate}>Create Stream</Link>
                </Button>
                <Panel>
                    <Panel.Heading>
                        Streams
                    </Panel.Heading>
                    <Panel.Body>
                        <table className={styles.table}>
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
                                    <tr className={styles.empty}>
                                        <td colSpan="5">No Streams</td>
                                    </tr>
                                )}
                                {Object.values(this.props.streams).map((stream) => (
                                    <tr key={stream.id}>
                                        <td>
                                            <Link to={`${links.streamShow}/${stream.id}`}>
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
                        </table>
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
})
