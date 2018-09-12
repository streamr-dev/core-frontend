// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import links from '../../../../links'
import { getStreams } from '../../../modules/stream/actions'
import * as StreamDelete from '../Show/InfoView/StreamDeleteButton'
import Table from '../../Table'
import withI18n from '../../../../marketplace/containers/WithI18n'
// import type { StoreState } from '../../../../marketplace/flowtype/store-state'
// import type { Stream, StreamList, StreamId } from '../../../flowtype/stream-types'

type StateProps = {
    streams: any,
}

type DispatchProps = {
    getStreams: () => void,
}

export type Props = StateProps & DispatchProps

const StreamDeleteButton = connect(null, StreamDelete.mapDispatchToProps)(StreamDelete.StreamDeleteButton)

class StreamList extends Component<Props> {
    componentDidMount() {
        this.props.getStreams()
    }

    render() {
        return (
            <div className="container">
                <Button id="streamlist-create-stream">
                    <Link to={links.streamCreate}>Create Stream</Link>
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
                </Table>
            </div>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    streams: state.stream.byId,
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStreams: () => dispatch(getStreams()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withI18n(StreamList))
