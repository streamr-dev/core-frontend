// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import Skeleton from 'react-loading-skeleton'

import Header from './Header'

import styles from './communityStats.pcss'

export type Props = {
    label: string | Node,
    value?: string,
    unit?: string,
    loading?: boolean,
    className?: string
}

export const Value = ({
    label,
    value,
    unit,
    loading,
    className,
}: Props) => (
    <div className={cx(styles.stat, className)}>
        <Header>{label}</Header>
        {!loading ? (
            <div className={styles.statValue}>
                {value}
                {unit && (
                    <span className={styles.statUnit}> {unit}</span>
                )}
            </div>
        ) : <Skeleton />}
    </div>
)

export default Value
