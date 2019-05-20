import React from 'react'

import styles from './Status.pcss'

function format(diff, divisor, unit, prev) {
    const val = Math.round(diff / divisor)
    return val <= 1 ? prev : `${val} ${unit}s ago`
}

const units = [
    {
        max: 2760000,
        value: 60000,
        name: 'minute',
        prev: 'a minute ago',
    },
    {
        max: 72000000,
        value: 3600000,
        name: 'hour',
        prev: 'an hour ago',
    },
    {
        max: 518400000,
        value: 86400000,
        name: 'day',
        prev: 'yesterday',
    },
    {
        max: 2419200000,
        value: 604800000,
        name: 'week',
        prev: 'last week',
    },
    {
        max: 28512000000,
        value: 2592000000,
        name: 'month',
        prev: 'last month',
    }, // max: 11 months
]

function ago(date) {
    const diff = Math.abs(Date.now() - date.getTime())
    // less than a minute
    if (diff < 60000) {
        return 'just now'
    }

    for (let i = 0; i < units.length; i += 1) {
        if (diff < units[i].max) {
            return format(diff, units[i].value, units[i].name, units[i].prev)
        }
    }
    // `year` is the final unit.
    // same as:
    //  {
    //    max: Infinity,
    //    value: 31536000000,
    //    name: 'year',
    //    prev: 'last year'
    //  }
    return format(diff, 31536000000, 'year', 'last year')
}

export default class Status extends React.Component {
    componentDidMount() {
        this.periodicUpdate()
    }

    componentWillUnmount() {
        clearTimeout(this.period)
    }

    periodicUpdate() {
        clearTimeout(this.period)
        this.period = setTimeout(() => (
            this.periodicUpdate()
        ), 10000 + Math.random())
        this.forceUpdate()
    }

    render() {
        const { updated } = this.props
        return (
            <div className={styles.status} title={new Date(updated).toLocaleTimeString()}>
                Updated {ago(new Date(updated))}
            </div>
        )
    }
}

export const CannotSaveStatus = () => (
    <div className={styles.status}>
        Canvas is read-only
    </div>
)
