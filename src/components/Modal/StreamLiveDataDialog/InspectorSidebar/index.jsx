// @flow

import React, { Fragment } from 'react'
import { Table } from '@streamr/streamr-layout'
import stringifyObject from 'stringify-object'
import { upper } from 'case'

import type { DataPoint } from '../../../StreamLivePreview'
import { formatDateTime } from '../../../../utils/time'
import styles from './inspectorSidebar.pcss'

type Props = {
    dataPoint: ?DataPoint,
}

const formatValue = (data: any): string => {
    if (typeof data === 'object') {
        return stringifyObject(data, {
            inlineCharacterLimit: Infinity,
        })
    }
    return data.toString()
}

const InspectorSidebar = ({ dataPoint }: Props) => (
    <div className={styles.inspectorSidebar}>
        <h5 className={styles.title}>Inspector</h5>
        <Table className={styles.inspectorSidebarTable}>
            <tbody>
                {dataPoint ? (
                    <Fragment>
                        <tr>
                            <th>Stream Id</th>
                            <td>{dataPoint && dataPoint.metadata.streamId}</td>
                        </tr>
                        <tr>
                            <th>Timestamp</th>
                            <td>{dataPoint && formatDateTime(dataPoint.metadata.timestamp)}</td>
                        </tr>
                        {/* In theory the data doesn't have to be object. Then we just skip it */}
                        {dataPoint && dataPoint.data && typeof dataPoint.data === 'object' && Object.entries(dataPoint.data).map(([k, v]) => {
                            const value = formatValue(v)
                            return (
                                <tr key={`${k}${value}`}>
                                    <th>{upper(k)}</th>
                                    <td>{value}</td>
                                </tr>
                            )
                        })}
                    </Fragment>
                ) : (
                    <tr>
                        <th>
                            No Data
                        </th>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
)

export default InspectorSidebar
