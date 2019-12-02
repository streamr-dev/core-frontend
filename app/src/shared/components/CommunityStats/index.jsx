// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import Skeleton from 'react-loading-skeleton'

import styles from './communityStats.pcss'

type StatHeaderProps = {
    children?: Node,
}

type Stat = {
    id: string,
    label: string | Node,
    value?: string,
    unit?: string,
    loading?: boolean,
}

type Props = {
    stats: Array<Stat>,
    className?: string
}

export const StatHeader = ({ children }: StatHeaderProps) => (
    <div className={styles.statHeading}>{children}</div>
)

export const CommunityStat = ({
    id,
    label,
    value,
    unit,
    loading,
}: Stat) => (
    <div key={id} className={styles.stat}>
        <StatHeader>{label}</StatHeader>
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

const CommunityStats = ({ stats, className }: Props) => (
    <div className={cx(styles.stats, className)}>
        {stats.map((stat) => (
            <CommunityStat key={stat.id} {...stat} />
        ))}
    </div>
)

export default CommunityStats
