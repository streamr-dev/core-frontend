// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import styles from './accountTab.pcss'

type Props = {
    className?: string,
    name: string,
    selected: string,
    to: string,
    children: Node
}

const AccountTab = ({
    className,
    name,
    selected,
    to,
    children,
}: Props) => (
    <Link
        className={classnames(className, styles.tab, selected === name && styles.active)}
        to={to}
    >
        {children}
    </Link>
)

export default AccountTab
