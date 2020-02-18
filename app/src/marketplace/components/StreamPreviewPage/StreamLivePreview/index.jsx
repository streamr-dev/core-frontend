// @flow

import React, { Fragment, useState, useCallback, useRef, useContext } from 'react'
import classnames from 'classnames'
import { Table } from 'reactstrap'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import throttle from 'lodash/throttle'
import { Translate } from 'react-redux-i18n'
import MediaQuery from 'react-responsive'
import SwipeableViews from 'react-swipeable-views'

import { sm } from '$app/scripts/breakpoints'
import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import { Context as ClientContext } from '$shared/contexts/StreamrClient'
import { formatDateTime } from '../../../utils/time'
import type { StreamId } from '$shared/flowtype/stream-types'
import useIsMounted from '$shared/hooks/useIsMounted'

import styles from './streamLivePreview.pcss'

const tz = moment.tz.guess()

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
    selectedDataPoint: ?DataPoint,
    onSelectDataPoint: (DataPoint, ?boolean) => void,
    run?: boolean,
    userpagesPreview?: boolean,
    hasData?: () => void,
}

const LOCAL_DATA_LIST_LENGTH = 10

const prettyPrintData = (data: ?{}, compact: boolean = false) => stringifyObject(data, {
    indent: '  ',
    inlineCharacterLimit: compact ? Infinity : 5,
})

const getNumberOfRows = (isMobile: boolean) => (isMobile ? 5 : 8)

const StreamLivePreview = ({
    streamId,
    selectedDataPoint,
    onSelectDataPoint,
    userpagesPreview,
    hasData,
    run = true,
}: Props) => {
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState([])
    const [dataError, setDataError] = useState(false)
    const [mobileTableColumnIndex, setMobileTableColumnIndex] = useState(0)
    const { hasLoaded, client } = useContext(ClientContext)
    const isMounted = useIsMounted()

    const updateDataToState = useCallback(throttle((data) => {
        if (hasData && visibleData.length === 0) {
            hasData()
        }
        setVisibleData([...data])

        if (!selectedDataPoint && data.length) {
            onSelectDataPoint(data[0], true)
        }
    }, 100), [hasData, selectedDataPoint])

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }

        const dataPoint: DataPoint = {
            data,
            metadata,
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted])

    return (
        <SubscriptionStatusProvider>
            <Subscription
                uiChannel={{
                    id: streamId,
                }}
                resendLast={LOCAL_DATA_LIST_LENGTH}
                onSubscribed={() => {
                    // Clear data when subscribed to make sure
                    // we don't get duplicate messages with resend
                    setVisibleData([])
                    dataRef.current = []
                }}
                isActive={run}
                onMessage={onData}
                onErrorMessage={() => setDataError(true)}
            />
            <MediaQuery maxWidth={sm.max}>
                {(isMobile) => {
                    const length = getNumberOfRows(isMobile)
                    let data = visibleData.slice(0, length)

                    // Pad array with nulls to fill preview length
                    if (userpagesPreview) {
                        const originalLength = data.length
                        data.length = length
                        data = data.fill(null, originalLength, length)
                    }

                    return (
                        <div className={styles.streamLivePreview}>
                            {(isMobile) ? (
                                <Fragment>
                                    <div className={styles.carouselContainer}>
                                        <SwipeableViews
                                            index={mobileTableColumnIndex}
                                            onChangeIndex={(idx) => setMobileTableColumnIndex(idx)}
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
                                                    {
                                                        data.map((d, index) => {
                                                            if (d == null) {
                                                                return (
                                                                    // eslint-disable-next-line react/no-array-index-key
                                                                    <tr key={index}>
                                                                        <td className={styles.timestampColumn} />
                                                                    </tr>
                                                                )
                                                            }

                                                            return (
                                                                <tr
                                                                    key={JSON.stringify(d.metadata.messageId)}
                                                                    onClick={() => onSelectDataPoint(d)}
                                                                >
                                                                    <td className={styles.timestampColumn}>
                                                                        {formatDateTime(d.metadata
                                                                            && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
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
                                                        <th>
                                                            <Translate value="streamLivePreview.data" />
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.map((d, index) => {
                                                            if (d == null) {
                                                                return (
                                                                    // eslint-disable-next-line react/no-array-index-key
                                                                    <tr key={index}>
                                                                        <td className={styles.messageColumn} />
                                                                    </tr>
                                                                )
                                                            }

                                                            return (
                                                                <tr
                                                                    key={JSON.stringify(d.metadata.messageId)}
                                                                    onClick={() => onSelectDataPoint(d)}
                                                                >
                                                                    <td className={styles.messageColumn}>
                                                                        <div className={styles.messagePreview}>
                                                                            {prettyPrintData(d.data, true)}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
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
                                                onClick={() => setMobileTableColumnIndex(idx)}
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
                                            <th>
                                                <Translate value="streamLivePreview.data" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((d, index) => {
                                                if (d == null) {
                                                    return (
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        <tr key={index}>
                                                            <td className={styles.timestampColumn} />
                                                            <td className={styles.messageColumn} />
                                                        </tr>
                                                    )
                                                }

                                                return (
                                                    <tr
                                                        key={JSON.stringify(d.metadata.messageId)}
                                                        onClick={() => onSelectDataPoint(d)}
                                                    >
                                                        <td className={styles.timestampColumn}>
                                                            {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                                        </td>
                                                        <td className={styles.messageColumn}>
                                                            <div className={styles.messagePreview}>
                                                                {prettyPrintData(d.data, true)}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            )}
                            {hasLoaded && !client && (
                                <p className={styles.errorNotice}>
                                    <Translate value="streamLivePreview.subscriptionErrorNotice" />
                                </p>
                            )}
                            {dataError && (
                                <p className={styles.errorNotice}>
                                    <Translate value="streamLivePreview.dataErrorNotice" />
                                </p>
                            )}
                        </div>
                    )
                }}
            </MediaQuery>
        </SubscriptionStatusProvider>
    )
}

export default StreamLivePreview
