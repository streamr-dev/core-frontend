// @flow

import React from 'react'
import cx from 'classnames'
import RangeSelect from './RangeSelect'
import styles from './chart.pcss'

type Props = {
    className?: ?string,
}

const Chart = ({ className }: Props) => (
    <div className={cx(styles.root, className)}>
        <div className={styles.toolbar}>
            <RangeSelect />
        </div>
    </div>
)

export default Chart
