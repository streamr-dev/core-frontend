// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './sidebar.pcss'

type Props = {
    children?: Node,
}

const Content = ({ children }: Props) => (
    <div className={cx(styles.content)}>
        {children}
    </div>
)

export default Content
