// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import FontAwesome from 'react-fontawesome'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { throttle } from 'lodash'

import type { Stream } from '../../../flowtype/stream-types'
import type { User } from '../../../flowtype/user-types'
import type { StreamState } from '../../../flowtype/states/stream-state'
import type { UserState } from '../../../flowtype/states/user-state'

import { withClient } from '../../StreamrClientProvider'
import type { ClientProp } from '../../StreamrClientProvider'

import styles from './previewView.pcss'

type DataPoint = {
    data: {},
    metadata: {
        timestamp: number
    }
}

type StateProps = {
    stream: ?Stream,
    currentUser: ?User,
}

type Props = StateProps & ClientProp

type State = {
    visibleData: Array<DataPoint>,
    visibleDataLimit: number,
    paused: boolean,
    infoScreenMessage: ?DataPoint
}

export class PreviewView extends Component<Props, State> {
    static prettyPrintData = (data: ?{}, compact: boolean = false) => stringifyObject(data, {
        indent: '  ',
        inlineCharacterLimit: compact ? Infinity : 5,
    })

    static prettyPrintDate = (timestamp: ?number, timezone: ?string) => timestamp && moment.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')

    state = {
        visibleData: [],
        visibleDataLimit: 10,
        paused: false,
        infoScreenMessage: null,
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.stream && newProps.stream.id && !this.subscription) {
            this.subscription = this.props.client.subscribe({
                stream: newProps.stream.id,
                resend_last: this.state.visibleDataLimit,
            }, (data, metadata) => this.onData({
                data,
                metadata,
            }))
        }
    }

    onData = (dataPoint: DataPoint) => {
        this.data.unshift(dataPoint)
        if (this.data.length > this.state.visibleDataLimit) {
            this.data.pop()
        }
        this.updateDataToState(this.data)
    }

    subscription: any

    data: Array<{}>

    data = []

    updateDataToState = throttle((data) => {
        this.setState({
            visibleData: [...data],
        })
    }, 100)

    openInfoScreen = (d: DataPoint) => {
        this.setState({
            infoScreenMessage: d,
        })
    }

    closeInfoScreen = () => {
        this.setState({
            infoScreenMessage: null,
        })
    }

    pause = () => {
        this.props.client.pause()
        this.setState({
            paused: true,
        })
    }

    unpause = () => {
        this.props.client.connect()
        this.setState({
            paused: false,
        })
    }

    render() {
        const tz = (this.props.currentUser && this.props.currentUser.timezone) || moment.tz.guess()
        return (
            <Fragment>
                <h1>Recent Events</h1>
                <div className="panel-heading-controls">
                    {this.state.paused ? (
                        <Button
                            size="sm"
                            color="primary"
                            onClick={this.unpause}
                            title="Continue"
                        >
                            <FontAwesome name="play" />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={this.pause}
                            title="Pause"
                        >
                            <FontAwesome name="pause" />
                        </Button>
                    )}
                </div>
                <Table className={styles.dataTable} striped hover>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.visibleData.map((d) => (
                            <tr key={JSON.stringify(d.metadata)} onClick={() => this.openInfoScreen(d)}>
                                <td className={styles.timestampColumn}>
                                    {PreviewView.prettyPrintDate(d.metadata && d.metadata.timestamp, tz)}
                                </td>
                                <td className={styles.messageColumn}>
                                    <div className={styles.messagePreview}>
                                        {PreviewView.prettyPrintData(d.data, true)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal
                    show={this.state.infoScreenMessage != null}
                    onHide={this.closeInfoScreen}
                >
                    <ModalHeader closeButton>
                        Info about data point
                    </ModalHeader>
                    <ModalBody>
                        <Table className={styles.infoScreenModalTable}>
                            <tbody>
                                <tr>
                                    <th>Stream id</th>
                                    <td>{this.props.stream && this.props.stream.id}</td>
                                </tr>
                                <tr>
                                    <th>Message Timestamp</th>
                                    <td>
                                        {PreviewView.prettyPrintDate(
                                            this.state.infoScreenMessage
                                            && this.state.infoScreenMessage.metadata
                                            && this.state.infoScreenMessage.metadata.timestamp,
                                            tz,
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Data</th>
                                    <td className={styles.dataColumn}>
                                        <code>
                                            {PreviewView.prettyPrintData(this.state.infoScreenMessage && this.state.infoScreenMessage.data)}
                                        </code>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ stream, user }: {stream: StreamState, user: UserState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
    currentUser: user.currentUser,
})

export default connect(mapStateToProps)(withClient(PreviewView))
