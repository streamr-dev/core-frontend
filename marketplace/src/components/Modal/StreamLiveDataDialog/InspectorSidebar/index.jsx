// @flow

import React, { Component, Fragment } from 'react'
import moment from 'moment-timezone'
import { Table } from '@streamr/streamr-layout'
import stringifyObject from 'stringify-object'
import { upper } from 'case'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import type { DataPoint } from '../../../StreamLivePreview'
import { formatDateTime } from '../../../../utils/time'
import type { User } from '../../../../flowtype/user-types'

import styles from './inspectorSidebar.pcss'

type Props = {
    dataPoint: ?DataPoint,
    currentUser: ?User,
}

const formatValue = (data: any): string => {
    if (typeof data === 'object') {
        return stringifyObject(data, {
            inlineCharacterLimit: Infinity,
        })
    }
    return data.toString()
}

const CopyIcon = () => (
    <svg width="14" height="21" xmlns="http://www.w3.org/2000/svg" className={styles.copyIcon}>
        <path
            d="M12.833 7.777h-2.722a.778.778 0 0 0 0 1.556h2.333v9.333H1.556V9.333h2.333a.778.778 0 0 0 0-1.556H1.167C.523 7.777
            0 8.3 0 8.944v10.11c0 .644.523 1.167 1.167 1.167h11.666c.644 0 1.167-.523 1.167-1.166V8.944c0-.644-.523-1.167-1.167-1.167M4.117
            4.438a.777.777 0 0 1 0-1.1l2.332-2.333a.779.779 0 0 1 1.102 0l2.332 2.333a.778.778 0 1 1-1.1 1.1L7.778 3.432v11.345a.778.778
            0 1 1-1.556 0V3.432L5.217 4.438a.777.777 0 0 1-1.1 0"
        />
    </svg>
)

const CopiedIcon = () => (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" className={styles.copiedIcon}>
        <g transform="translate(-2 -2)" stroke="#0324FF" fill="none">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.1 12.56l2.2 2.4 5.65-5.67" />
        </g>
    </svg>
)

type State = {
    copied: boolean,
}

class InspectorSidebar extends Component<Props, State> {
    state = {
        copied: false,
    }
    componentWillReceiveProps(newProps: Props) {
        const { dataPoint: newDataPoint } = newProps
        const { dataPoint } = newProps
        if (dataPoint && newDataPoint && dataPoint.metadata.streamId !== newDataPoint.metadata.streamId) {
            this.setState({
                copied: false,
            })
        }
    }
    onCopy = () => {
        this.setState({
            copied: true,
        })
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.setState({
                copied: false,
            })
        }, 3000)
    }
    timeout: ?TimeoutID = null
    render() {
        const { dataPoint } = this.props
        const streamId = dataPoint && dataPoint.metadata.streamId
        const tz = (this.props.currentUser && this.props.currentUser.timezone) || moment.tz.guess()
        return (
            <div className={styles.inspectorSidebar}>
                {this.state.copied}
                <div className={styles.titleRow}>
                    <span className={styles.title}>Inspector</span>
                    {streamId && (
                        <CopyToClipboard
                            text={streamId}
                            onCopy={this.onCopy}
                        >
                            <div className={styles.copyButton}>
                                <div className={styles.hoverLabel}>
                                    Copy Stream Id
                                </div>
                                {this.state.copied ? (
                                    <CopiedIcon />
                                ) : (
                                    <CopyIcon />
                                )}
                            </div>
                        </CopyToClipboard>
                    )}
                </div>
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
                                    <td>{dataPoint && formatDateTime(dataPoint.metadata.timestamp, tz)}</td>
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
    }
}

export default InspectorSidebar
