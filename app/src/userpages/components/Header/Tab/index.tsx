import type { Node } from 'react'
import React from 'react'
import cx from 'classnames'
import { NavLink } from 'react-router-dom'
import styles from './tab.pcss'
type Props = {
    children: Node
    className?: string | null | undefined
    to: string
}

const Tab = ({ className, to, children }: Props) => (
    <NavLink activeClassName={styles.active} className={cx(styles.root, className)} to={to}>
        {children}
    </NavLink>
)

export default Tab
