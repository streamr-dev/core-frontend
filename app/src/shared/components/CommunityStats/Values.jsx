// @flow

import React from 'react'
import cx from 'classnames'

import Value, { type Props as ValueProps } from './Value'

import styles from './communityStats.pcss'

type Props = {
    stats: Array<ValueProps>,
    className?: string
}

const Values = ({ stats, className }: Props) => (
    <div className={cx(styles.stats, className)}>
        {stats.map((stat) => (
            <Value key={stat.id} {...stat} />
        ))}
    </div>
)

export default Values
