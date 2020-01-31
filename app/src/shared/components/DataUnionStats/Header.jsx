// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './dataUnionStats.pcss'

type Props = {
    children?: Node,
    className?: string
}

export const Header = ({ children, className }: Props) => (
    <div className={cx(styles.statHeading, className)}>{children}</div>
)

export default Header
