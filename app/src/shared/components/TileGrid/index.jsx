// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './tileGrid.pcss'

type Props = {
    className?: string,
    children?: Node,
}

const TileGrid = ({ className, children }: Props) => (
    <div className={cx(styles.root, className)}>
        {children}
    </div>
)

export default TileGrid
