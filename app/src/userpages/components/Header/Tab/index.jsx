// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import { Link, type Location, withRouter } from 'react-router-dom'
import styles from './tab.pcss'

type Props = {
    children: Node,
    className?: ?string,
    location: Location,
    to: string,
}

const Tab = withRouter(({ className, to, location: { pathname }, children }: Props) => (
    <Link
        className={cx(styles.root, className, {
            [styles.active]: pathname.includes(to),
        })}
        to={to}
    >
        {children}
    </Link>
))

export default Tab
