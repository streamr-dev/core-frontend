// @flow

import React from 'react'
import cx from 'classnames'

import Value, { type Props as ValueProps } from './Value'

import styles from './communityStats.pcss'

export type StatValue = {
    id: string,
} & ValueProps

type Props = {
    stats: Array<StatValue>,
    className?: string
}

const Values = ({ stats, className }: Props) => (
    <div className={cx(styles.stats, className)}>
        {stats.map((stat) => (
            <Value {...stat} key={stat.id} />
        ))}
    </div>
)

export default Values
