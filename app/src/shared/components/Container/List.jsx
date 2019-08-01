// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './list.pcss'

type Props = {
    className?: string,
    children?: Node,
}

const List = ({ className, children }: Props) => (
    <div className={cx(styles.root, className)}>
        {children}
    </div>
)

export default List
