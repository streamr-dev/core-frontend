import React from 'react'
import uuid from 'uuid'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import styles from './Table.pcss'

function getCellContent(cell) {
    let content = cell
    if (cell != null && cell instanceof Object) {
        /* eslint-disable no-underscore-dangle */
        if (cell.__streamr_date) {
            // special handling for __streamr_date
            const date = new Date(cell.__streamr_date)
            return `${date.toLocaleString()}.${date.getMilliseconds()}`
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
        Object.keys(d.dm).forEach((key) => {
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
    state = {
        rows: [],
        headers: [],
        title: '',
        // init state from module tableConfig
        ...(this.props.module.tableConfig || {}),
    }

    onMessage = (d) => {
        const { options = {} } = this.props.module
        this.setState(parseMessage(d, options))
    }

    render() {
        const { module, isActive, className } = this.props
        const { options = {} } = module
        const { title, headers, rows } = this.state

        return (
            <div className={cx(styles.tableModule, className)}>
                <ModuleSubscription isActive={isActive} onMessage={this.onMessage} />
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
                                    <td key={index}>{item}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
