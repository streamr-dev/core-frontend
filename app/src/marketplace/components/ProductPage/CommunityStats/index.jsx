// @flow

import React from 'react'
import cx from 'classnames'
import Skeleton from 'react-loading-skeleton'

import styles from './communityStats.pcss'

type Stat = {
    id: string,
    label: string,
    value?: string,
    unit?: string,
    loading?: boolean,
}

type Props = {
    stats: Array<Stat>,
    className?: string
}

const CommunityStats = ({ stats, className }: Props) => (
    <div className={cx(styles.stats, className)}>
        {stats.map(({
            id,
            label,
            value,
            unit,
            loading,
        }) => (
            <div key={id}>
                <div className={styles.statHeading}>{label}</div>
                {!loading ? (
                    <div className={styles.statValue}>
                        {value}
                        {unit && (
                            <span className={styles.statUnit}> {unit}</span>
                        )}
                    </div>
                ) : <Skeleton />}
            </div>
        ))}
    </div>
)

export default CommunityStats
