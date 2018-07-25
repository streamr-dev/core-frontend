// @flow

import React, { Component } from 'react'
import StreamrClient from 'streamr-client'
import { Table } from 'reactstrap'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import throttle from 'lodash/throttle'
import { Translate } from '@streamr/streamr-layout'
import MediaQuery from 'react-responsive'
import { sm } from '@streamr/streamr-layout/src/breakpoints'

import { formatDateTime } from '../../utils/time'
import type { StreamId } from '../../flowtype/stream-types'
import type { ApiKey, User } from '../../flowtype/user-types'

import styles from './streamLivePreview.pcss'

export type DataPoint = {
    data: any,
    metadata: {
        offset: number,
        timestamp: number,
        streamId: StreamId,
    }
}

type Props = {
    streamId: ?StreamId,
    currentUser: ?User,
    apiKey: ?ApiKey,
    selectedDataPoint: ?DataPoint,
    onSelectDataPoint: (DataPoint, ?boolean) => void,
}

type State = {
    visibleData: Array<DataPoint>,
    visibleDataLimit: number,
}

let cachedClient: ?StreamrClient

export class StreamLivePreview extends Component<Props, State> {
    state = {
        visibleData: [],
        visibleDataLimit: 8,
    }

    componentDidMount() {
        this.createClientAndSubscribe()
    }

    componentWillUnmount = () => {
        this.unsubscribe()
        this.updateDataToState.cancel()
    }

    onData = (dataPoint: DataPoint) => {
        this.data.unshift(dataPoint)
        this.data.length = Math.min(this.data.length, this.state.visibleDataLimit)
        this.updateDataToState(this.data)
    }

    dataColumn: ?HTMLTableCellElement = null

    createClientAndSubscribe = () => {
        const { apiKey, streamId } = this.props
        this.client = this.createClient(apiKey)
        if (this.client && streamId) {
            this.subscribe(streamId)
        }
    }

    createClient = (apiKey: ?ApiKey): ?StreamrClient => {
        if (!cachedClient || (apiKey && cachedClient.options.apiKey !== apiKey.id)) {
            cachedClient = new StreamrClient({
                url: process.env.STREAMR_WS_URL,
                apiKey: apiKey ? apiKey.id : undefined,
                autoconnect: true,
                autoDisconnect: false,
            })
        }
        return cachedClient
    }

    subscribe = (streamId: ?StreamId) => {
        if (!streamId) {
            return
        }
        if (this.subscription) {
            this.unsubscribe()
        }
        this.subscription = this.client.subscribe({
            stream: streamId,
            resend_last: this.state.visibleDataLimit,
        }, (data, metadata) => this.onData({
            data,
            metadata,
        }))
    }

    unsubscribe = () => {
        if (this.client && this.subscription) {
            this.client.unsubscribe(this.subscription)
        }
    }

    prettyPrintData = (data: ?{}, compact: boolean = false) => stringifyObject(data, {
        indent: '  ',
        inlineCharacterLimit: compact ? Infinity : 5,
    })

    subscription: any
    data: Array<{}> = []
    client: StreamrClient

    updateDataToState = throttle((data) => {
        this.setState({
            visibleData: [...data],
        })
        if (!this.props.selectedDataPoint && data.length) {
            this.props.onSelectDataPoint(data[0], true)
        }
    }, 100)

    clearData = () => {
        this.data = []
        this.setState({
            visibleData: [],
        })
    }

    render() {
        const tz = (this.props.currentUser && this.props.currentUser.timezone) || moment.tz.guess()
        return (
            <MediaQuery maxWidth={sm.max}>
                {(isMobile) => {
                    if (isMobile && this.state.visibleDataLimit !== 5) {
                        this.setState({
                            visibleDataLimit: 5,
                        })
                    }
                    return (
                        <div className={styles.streamLivePreview}>
                            <Table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.timestampColumn}>
                                            <Translate value="streamLivePreview.timestamp" />
                                        </th>
                                        <th
                                            ref={(th) => {
                                                this.dataColumn = th
                                            }}
                                        >
                                            <Translate value="streamLivePreview.data" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.visibleData.map((d) => (
                                        <tr key={d.metadata.offset} onClick={() => this.props.onSelectDataPoint(d)}>
                                            <td className={styles.timestampColumn}>
                                                {formatDateTime(d.metadata && d.metadata.timestamp, tz)}
                                            </td>
                                            <td className={styles.messageColumn}>
                                                <div
                                                    className={styles.messagePreview}
                                                    style={{
                                                        maxWidth: (!isMobile && this.dataColumn && (this.dataColumn.offsetWidth - 50)) || null,
                                                    }}
                                                >
                                                    {this.prettyPrintData(d.data, true)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )
                }}
            </MediaQuery>
        )
    }
}

export default StreamLivePreview
