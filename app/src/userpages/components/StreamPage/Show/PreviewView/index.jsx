// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import type { StoreState } from '$shared/flowtype/store-state'

import { withClient } from '../../../StreamrClientProvider'
import type { ClientProp } from '../../../StreamrClientProvider'

import styles from './previewView.pcss'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$mp/modules/user/selectors'

type DataPoint = {
    data: {},
    metadata: {
        timestamp: number
    }
}

type StateProps = {
    stream: ?Stream,
    currentUser: ?User
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

    static prettyPrintDate = (timestamp: ?number, timezone: ?string) => timestamp && moment.tz(timestamp, timezone).format()

    state = {
        visibleData: [],
        visibleDataLimit: 10,
        paused: false,
        infoScreenMessage: null,
    }

    componentDidMount() {
        if (this.props.stream && this.props.stream.id && !this.subscription) {
            this.subscribe(this.props.stream)
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.stream && newProps.stream.id && !this.subscription) {
            this.subscribe(newProps.stream)
        }
    }

    onData = (dataPoint: DataPoint) => {
        this.setState(({ visibleData, visibleDataLimit }) => ({
            visibleData: [
                dataPoint,
                ...visibleData,
            ].slice(0, visibleDataLimit),
        }))
    }

    subscribe = (stream: Stream) => {
        this.subscription = this.props.client.subscribe({
            stream: stream.id,
            resend_last: this.state.visibleDataLimit,
        }, (data, metadata) => this.onData({
            data,
            metadata,
        }))
    }

    subscription: any

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
            <div>
                <Fragment>
                    Realtime Data Preview
                    <div className="panel-heading-controls">
                        {this.state.paused ? (
                            <Button
                                size="sm"
                                color="primary"
                                onClick={this.unpause}
                                title="Continue"
                            >
                                Play
                            </Button>
                        ) : (
                            <Button
                                onClick={this.pause}
                                title="Pause"
                            >
                                Pause
                            </Button>
                        )}
                    </div>
                </Fragment>
                <Fragment>
                    <Table className={styles.dataTable} striped hover>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Message JSON</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.visibleData.map((d) => (
                                <tr key={JSON.stringify(d.metadata)}>
                                    <td className={styles.timestampColumn}>
                                        {PreviewView.prettyPrintDate(d.metadata && d.metadata.timestamp, tz)}
                                    </td>
                                    <td className={styles.messageColumn}>
                                        <div className={styles.messagePreview}>
                                            {PreviewView.prettyPrintData(d.data, true)}
                                        </div>
                                    </td>
                                    <td>
                                        <a href="#" onClick={() => this.openInfoScreen(d)}>
                                            ?
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Fragment>
                <Fragment>
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
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
    currentUser: selectUserData(state),
})

export default connect(mapStateToProps)(withClient(PreviewView))
