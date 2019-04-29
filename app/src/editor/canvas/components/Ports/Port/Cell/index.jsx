// @flow

import React from 'react'
import cx from 'classnames'
import styles from './cell.pcss'

type Props = {
    className?: ?string,
}

const Cell = ({ className, ...props }: Props) => (
    <div
        {...props}
        className={cx(styles.root, className)}
    />
)

export default Cell
