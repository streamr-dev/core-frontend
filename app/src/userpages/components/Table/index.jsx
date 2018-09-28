import React from 'react'
import cx from 'classnames'

import styles from './table.pcss'

export default function Table({ className, ...props }) {
    return <table className={cx(styles.table, className)} {...props} />
}

export function EmptyRow({ className, ...props }) {
    return (
        <tr className={cx(styles.empty, className)} {...props} />
    )
}

Table.EmptyRow = EmptyRow
