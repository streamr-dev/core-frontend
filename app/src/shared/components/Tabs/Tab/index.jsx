// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './tab.pcss'

type Props = {
    children: Node,
    active?: boolean,
    className?: string,
    // Only needed when rendering the parent component 'Tabs'
    title?: string, // eslint-disable-line react/no-unused-prop-types
    isExtra?: boolean, // eslint-disable-line react/no-unused-prop-types
}

const Tab = ({ children, active, className }: Props) => (
    <div className={classNames(className, styles.step, active && styles.active)}>
        {children}
    </div>
)

Tab.defaultProps = {
    isExtra: false,
}

export default Tab
