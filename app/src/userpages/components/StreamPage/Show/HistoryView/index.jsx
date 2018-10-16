// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'

import { getRange, deleteDataUpTo } from '$userpages/modules/userPageStreams/actions'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'

import CSVImport from './CSVImport'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    deleteDataUpTo: (streamId: StreamId, date: Date) => Promise<any>
}

type Props = StateProps & DispatchProps

type State = {
    range?: {
        beginDate: string,
        endDate: string,
    },
    deleteDate?: Date,
}

class HistoryView extends Component<Props, State> {
    state = {}

    componentDidMount() {
        this.load(this.props)
    }

    load({ stream }) {
        if (stream && stream.id) {
            getRange(stream.id).then((range) => {
                this.setState({
                    range,
                })
            }, console.error)
        }
    }

    onDeleteDateChanged = (event) => {
        this.setState({
            deleteDate: event.target.value,
        })
    }

    deleteDataUpTo = (streamId: StreamId, date?: Date) => {
        if (date) {
            this.props.deleteDataUpTo(streamId, date)
        }
    }

    render() {
        const { range, deleteDate } = this.state
        const { stream } = this.props
        return (
            <Fragment>
                <h1>History</h1>
                <Col md={6}>
                    {stream && range && range.beginDate && range.endDate && (
                        <div>
                            <span>
                                This stream has stored events between&nbsp;
                                <strong>{new Date(range.beginDate).toLocaleDateString()}</strong> and&nbsp;
                                <strong>{new Date(range.endDate).toLocaleDateString()}</strong>.
                            </span>
                            <p>Delete events up to and including</p>
                            <input type="date" onChange={this.onDeleteDateChanged} />
                            <button type="button" onClick={() => this.deleteDataUpTo(stream.id, deleteDate)}>Delete</button>
                        </div>
                    )}
                </Col>
                <Col md={6}>
                    <CSVImport />
                </Col>
            </Fragment>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    deleteDataUpTo(streamId: StreamId, date: Date) {
        return dispatch(deleteDataUpTo(streamId, date))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryView)
