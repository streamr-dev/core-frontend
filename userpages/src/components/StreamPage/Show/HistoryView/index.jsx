// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Panel } from 'react-bootstrap'

import { getRange } from '../../../../modules/stream/actions'

import type { Stream } from '../../../../flowtype/stream-types'
import type { StreamState } from '../../../../flowtype/states/stream-state'

import CSVImport from './CSVImport'

type Props = {
    stream: ?Stream,
}

type State = {
    range?: {
        beginDate: string,
        endDate: string,
    }
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

    render() {
        const { range } = this.state
        return (
            <Panel>
                <Panel.Heading>
                    History
                </Panel.Heading>
                <Panel.Body>
                    <Col md={6}>
                        {range && (
                            <span>
                                This stream has stored events between&nbsp;
                                <strong>{new Date(range.beginDate).toLocaleDateString()}</strong> and&nbsp;
                                <strong>{new Date(range.endDate).toLocaleDateString()}</strong>.
                            </span>
                        )}
                        <input />
                    </Col>
                    <Col md={6}>
                        <CSVImport />
                    </Col>
                </Panel.Body>
            </Panel>
        )
    }
}

const mapStateToProps = ({ stream }: {stream: StreamState }): Props => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

export default connect(mapStateToProps)(HistoryView)
