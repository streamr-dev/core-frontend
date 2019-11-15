// @flow

import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import StreamrClient from 'streamr-client'
import { Table } from 'reactstrap'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import throttle from 'lodash/throttle'
import { Translate } from 'react-redux-i18n'
import MediaQuery from 'react-responsive'
import SwipeableViews from 'react-swipeable-views'
import { sm } from '$app/scripts/breakpoints'

import { formatDateTime } from '../../../utils/time'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'

import styles from './streamLivePreview.pcss'

export type DataPoint = {
    data: any,
    metadata: {
        messageId: {
            streamId: StreamId,
            timestamp: number,
        },
    }
}

type Props = {
    streamId: ?StreamId,
    authApiKeyId: ?ResourceKeyId,
    selectedDataPoint: ?DataPoint,
    onSelectDataPoint: (DataPoint, ?boolean) => void,
    run?: boolean,
    userpagesPreview?: boolean,
    hasData?: () => void,
}

type State = {
    visibleData: Array<DataPoint>,
    subscriptionError: boolean,
    dataError: boolean,
    mobileTableColumnIndex: number,
}

let cachedClient: ?StreamrClient

const LOCAL_DATA_LIST_LENGTH = 10

export class StreamLivePreview extends Component<Props, State> {
    static defaultProps = {
        run: true,
    }

    state = {
        visibleData: [],
        subscriptionError: false,
        dataError: false,
        mobileTableColumnIndex: 0,
    }

    componentDidMount() {
        this.createClientAndSubscribe()
    }

    componentWillUnmount = () => {
        this.unsubscribe()
        this.updateDataToState.cancel()
    }

    onData = (dataPoint: DataPoint) => {
        if (this.props.hasData && this.state.visibleData.length === 0) {
            this.props.hasData()
        }

        if (this.props.run) {
            this.data.unshift(dataPoint)
            this.data.length = Math.min(this.data.length, LOCAL_DATA_LIST_LENGTH)
            this.updateDataToState(this.data)
        }
    }

    onMobileTableColumnIndexChange = (index: number) => {
        this.setState({
            mobileTableColumnIndex: index,
        })
    }

    dataColumn: ?HTMLTableCellElement = null

    createClientAndSubscribe = () => {
        const { authApiKeyId, streamId } = this.props
        this.client = this.createClient(authApiKeyId)
        if (this.client && streamId) {
            this.subscribe(streamId)
        }
    }

    createClient = (authApiKeyId: ?ResourceKeyId): ?StreamrClient => {
        if (!cachedClient || (authApiKeyId && cachedClient.options.apiKey !== authApiKeyId)) {
            cachedClient = new StreamrClient({
                url: process.env.STREAMR_WS_URL,
                restUrl: process.env.STREAMR_API_URL,
                auth: {
                    apiKey: authApiKeyId || undefined,
                },
                autoConnect: true,
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
        try {
            this.subscription = this.client.subscribe({
                stream: streamId,
                resend: {
                    last: LOCAL_DATA_LIST_LENGTH,
                },
            }, (data, metadata) => this.onData({
                data,
                metadata,
            }))
        } catch (e) {
            this.setState({
                subscriptionError: true,
            })
        }

        if (this.subscription) {
            // Log errors thrown by stream
            this.subscription.on('error', () => {
                if (!this.state.dataError) {
                    this.setState({
                        dataError: true,
                    })
                }
            })
        }
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
        const { userpagesPreview } = this.props
        const tz = moment.tz.guess()
        const { visibleData, mobileTableColumnIndex } = this.state

        return (
            <MediaQuery maxWidth={sm.max}>
                {(isMobile) => {
                    const data = isMobile ? visibleData.slice(0, 5) : visibleData.slice(0, 8)
                    return (
                        <div className={styles.streamLivePreview}>
                            {(isMobile) ? (
                                <Fragment>
                                    <div className={styles.carouselContainer}>
                                        <SwipeableViews
                                            index={mobileTableColumnIndex}
                                            onChangeIndex={this.onMobileTableColumnIndexChange}
                                            slideStyle={{
                                                overflow: 'visible',
                                            }}
                                            style={{
                                                overflowX: 'visible',
                                                height: '100%',
                                            }}
                                            containerStyle={{
                                                height: '100%',
                                            }}
                                        >
                                            <Table className={classnames(
                                                styles.dataTable,
                                                {
                                                    [styles.userpagesPreview]: userpagesPreview,
                                                },
                                            )}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className={styles.timestampColumn}>
                                                            <Translate value="streamLivePreview.timestamp" />
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((d) => (
                                                        <tr
                                                            key={JSON.stringify(d.metadata.messageId)}
                                                            onClick={() => this.props.onSelectDataPoint(d)}
                                                        >
                                                            <td className={styles.timestampColumn}>
                                                                {formatDateTime(d.metadata
                                                                    && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                                            </td>
                                                        </tr>))}
                                                </tbody>
                                            </Table>
                                            <Table className={classnames(
                                                styles.dataTable,
                                                styles.dataContentTable,
                                                {
                                                    [styles.userpagesPreview]: userpagesPreview,
                                                },
                                            )}
                                            >
                                                <thead>
                                                    <tr>
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
                                                    {data.map((d) => (
                                                        <tr
                                                            key={JSON.stringify(d.metadata.messageId)}
                                                            onClick={() => this.props.onSelectDataPoint(d)}
                                                        >
                                                            <td className={styles.messageColumn}>
                                                                <div className={styles.messagePreview}>
                                                                    {this.prettyPrintData(d.data, true)}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </SwipeableViews>
                                    </div>
                                    <div className={styles.dotContainer}>
                                        {[0, 1].map((idx) => (
                                            <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                                                key={idx}
                                                role="button"
                                                tabIndex={idx}
                                                className={classnames(styles.dot, {
                                                    [styles.active]: mobileTableColumnIndex === idx,
                                                })}
                                                onClick={() => this.onMobileTableColumnIndexChange(idx)}
                                            />
                                        ))}
                                    </div>
                                </Fragment>
                            ) : (
                                <Table className={classnames(
                                    styles.dataTable,
                                    {
                                        [styles.userpagesPreview]: userpagesPreview,
                                    },
                                )}
                                >
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
                                        {data.map((d) => (
                                            <tr
                                                key={JSON.stringify(d.metadata.messageId)}
                                                onClick={() => this.props.onSelectDataPoint(d)}
                                            >
                                                <td className={styles.timestampColumn}>
                                                    {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                                </td>
                                                <td className={styles.messageColumn}>
                                                    <div className={styles.messagePreview}>
                                                        {this.prettyPrintData(d.data, true)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            {this.state.subscriptionError && (
                                <p className={styles.errorNotice}>
                                    <Translate value="streamLivePreview.subscriptionErrorNotice" />
                                </p>
                            )}
                            {this.state.dataError && (
                                <p className={styles.errorNotice}>
                                    <Translate value="streamLivePreview.dataErrorNotice" />
                                </p>
                            )}
                        </div>
                    )
                }}
            </MediaQuery>
        )
    }
}

export default StreamLivePreview
