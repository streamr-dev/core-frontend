// @flow

import React, { Component } from 'react'
import { Col, Panel } from 'react-bootstrap'
import CSVImport from './CSVImport'

type Props = {}

type State = {}

export default class HistoryView extends Component<Props, State> {
    render() {
        return (
            <Panel>
                <Panel.Heading>
                    History
                </Panel.Heading>
                <Panel.Body>
                    <Col md={6}>
                        This stream has data....
                        <input />faslfjsadöf
                        fsalfkjasödflk
                        fajldfkjölkdfdfjl
                    </Col>
                    <Col md={6}>
                        <CSVImport />
                    </Col>
                </Panel.Body>
            </Panel>
        )
    }
}
