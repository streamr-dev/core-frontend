// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import Skeleton from 'react-loading-skeleton'

import Header from './Header'

import styles from './communityStats.pcss'

export type Props = {
    id: string,
    label: string | Node,
    value?: string,
    unit?: string,
    loading?: boolean,
    className?: string
}

export const Value = ({
    id,
    label,
    value,
    unit,
    loading,
    className,
}: Props) => (
    <div key={id} className={cx(styles.stat, className)}>
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
