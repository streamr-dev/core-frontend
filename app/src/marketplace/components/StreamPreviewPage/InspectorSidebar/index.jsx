// @flow

import React, { Fragment } from 'react'
import moment from 'moment-timezone'
import { Table } from 'reactstrap'
import stringifyObject from 'stringify-object'
import { Translate } from 'react-redux-i18n'

import CopyStreamIdButton from '../CopyStreamIdButton'
import type { DataPoint } from '../StreamLivePreview'
import { formatDateTime } from '$mp/utils/time'
import type { StreamId } from '$shared/flowtype/stream-types'

import styles from './inspectorSidebar.pcss'

type Props = {
    streamId: ?StreamId,
    dataPoint: ?DataPoint,
    onStreamIdCopy: () => void,
}

const formatValue = (data: any): string => {
    if (typeof data === 'object') {
        return stringifyObject(data, {
            inlineCharacterLimit: Infinity,
        })
    }
    return data.toString()
}

const InspectorSidebar = ({ streamId, dataPoint, onStreamIdCopy }: Props) => {
    const tz = moment.tz.guess()
    return (
        <div className={styles.inspectorSidebar}>
            <div className={styles.titleRow}>
                <Translate value="modal.streamLiveData.inspectorSidebar.title" className={styles.title} />
                {streamId && (
                    <CopyStreamIdButton
                        streamId={streamId}
                        onCopy={onStreamIdCopy}
                    />
                )}
            </div>
            <Table className={styles.inspectorSidebarTable}>
                <tbody>
                    {dataPoint ? (
                        <Fragment>
                            <tr>
                                <th><Translate value="modal.streamLiveData.inspectorSidebar.streamId" /></th>
                                <td>{dataPoint && dataPoint.metadata.messageId.streamId}</td>
                            </tr>
                            <tr>
                                <th><Translate value="modal.streamLiveData.inspectorSidebar.timestamp" /></th>
                                <td>{dataPoint && formatDateTime(dataPoint.metadata.messageId.timestamp, tz)}</td>
                            </tr>
                            {/* In theory the data doesn't have to be object. Then we just skip it */}
                            {dataPoint && dataPoint.data && typeof dataPoint.data === 'object' && Object.entries(dataPoint.data).map(([k, v]) => {
                                const value = formatValue(v)
                                return (
                                    <tr key={`${k}${value}`}>
                                        <th>{k.toUpperCase()}</th>
                                        <td>{value}</td>
                                    </tr>
                                )
                            })}
                        </Fragment>
                    ) : (
                        <tr>
                            <th>
                                <Translate value="modal.streamLiveData.inspectorSidebar.noData" />
                            </th>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default InspectorSidebar
