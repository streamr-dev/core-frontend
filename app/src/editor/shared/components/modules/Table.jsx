import React from 'react'
import uuid from 'uuid'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import moment from 'moment-timezone'
import { formatDateTime } from '$mp/utils/time'

import UiSizeConstraint from '../UiSizeConstraint'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Table.pcss'

const tz = moment.tz.guess()

function getCellContent(cell) {
    let content = cell
    if (cell != null && cell instanceof Object) {
        /* eslint-disable no-underscore-dangle */
        if (cell.__streamr_date) {
            // special handling for __streamr_date
            const date = new Date(cell.__streamr_date)
            return formatDateTime(date, tz)
        }
        /* eslint-enable no-underscore-dangle */
        content = JSON.stringify(cell)
    }
    return content
}

function addRow(rows, row, id = uuid(), op = 'prepend') {
    rows = rows.slice()
    const newRow = {
        id,
        cells: row.map((cell) => getCellContent(cell)),
    }

    // if already row with id, update that row
    const oldRowIndex = rows.findIndex((r) => r.id === id)
    if (oldRowIndex !== -1) {
        rows[oldRowIndex] = newRow
        return rows
    }

    if (op === 'append') {
        rows.push(newRow)
    }

    if (op === 'prepend') {
        rows.unshift(newRow)
    }

    return rows
}

const parseMessage = (d, options) => (state) => {
    const newState = {
        rows: state.rows,
    }

    if (d.nr) {
        // new row message
        newState.rows = addRow(newState.rows, d.nr, d.id)
    } else if (d.nc) {
        // new contents: 2d array that replaces existing contents
        d.nc.forEach((row, index) => {
            newState.rows = addRow(newState.rows, row, `row-${index}`, 'append')
        })
    } else if (d.nm) {
        // new map
        newState.rows = []
        Object.keys(d.nm).forEach((key) => {
            newState.rows = addRow(newState.rows, [key, d.nm[key]], `row-${key}`, 'append')
        })
    } else if (d.e != null && d.id) {
        // edit cell message: d.id=row id, d.e=cell index, d.c=cell content
        newState.rows = newState.rows.map((row) => {
            if (row.id !== d.id) { return row }
            const newRow = {
                ...row,
                cells: row.cells.slice(),
            }
            newRow.cells[Number(d.e)] = getCellContent(d.c)
            return newRow
        })
    } else if (d.hdr) {
        // set headers
        Object.assign(newState, d.hdr)
    }
    if (newState.rows !== state.rows) {
        const maxRows = (options.maxRows && options.maxRows.value) || Infinity
        // Remove last row(s) if table full
        newState.rows = newState.rows.slice(0, maxRows)
    }
    return newState
}

export default class TableModule extends React.Component {
    subscription = React.createRef()

    state = {
        rows: [],
        headers: [],
        title: '',
        // init state from module tableConfig
        ...(this.props.module.tableConfig || {}),
    }

    pendingState = this.state

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidMount() {
        this.initIfActive(this.props.isActive)
    }

    initIfActive = (isActive) => {
        if (isActive && this.props.canvas && !this.props.canvas.adhoc) {
            this.init()
        }
    }

    init = async () => {
        const { initRequest } = await this.subscription.current.send({
            type: 'initRequest',
        })
        if (this.unmounted) { return }
        this.setPendingState(initRequest)
    }

    setPendingState = (s) => {
        if (typeof s === 'function') {
            s = s(this.pendingState)
        }
        if (s === null || s === this.pendingState) {
            return
        }
        this.pendingState = {
            ...this.pendingState,
            ...s,
        }
        this.queueFlushPending()
    }

    onMessage = (d) => {
        const { options = {} } = this.props.module
        this.setPendingState(parseMessage(d, options))
    }

    queueFlushPending = throttle(() => {
        this.setState(this.pendingState)
    }, 250)

    render() {
        const { className, module } = this.props
        const { options = {} } = module
        const { title, headers, rows } = this.state

        return (
            <UiSizeConstraint minWidth={250} minHeight={150}>
                <div className={cx(styles.tableModule, className)}>
                    <ModuleSubscription
                        {...this.props}
                        ref={this.subscription}
                        onMessage={this.onMessage}
                        onActiveChange={this.initIfActive}
                    />
                    {!!(options.displayTitle && options.displayTitle.value && title) && (
                        <h4>{title}</h4>
                    )}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    {row.cells.map((item, index) => (
                                        /* eslint-disable-next-line react/no-array-index-key */
                                        <td key={index}>
                                            <div className={styles.cell}>
                                                {item != null ? String(item) : item}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </UiSizeConstraint>
        )
    }
}
