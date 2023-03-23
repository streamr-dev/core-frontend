import { Node } from 'react'
import React from 'react'
import cx from 'classnames'
import styles from './list.pcss'
type Props = {
    className?: string
    children?: Node
}

const List = ({ className, children, ...props }: Props) => (
    <div {...props} className={cx(styles.root, styles.ListContainer, className)}>
        {children}
    </div>
)

export default List
