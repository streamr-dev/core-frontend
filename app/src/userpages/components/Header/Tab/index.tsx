import type { FunctionComponent, ReactNode } from 'react'
import React from 'react'
import cx from 'classnames'
import { NavLink } from 'react-router-dom'
import styles from './tab.pcss'

const Tab: FunctionComponent<{
    children: ReactNode
    className?: string | null | undefined
    to: string
}> = ({ className, to, children }) => (
    <NavLink activeClassName={styles.active} className={cx(styles.root, className)} to={to}>
        {children}
    </NavLink>
)

export default Tab
