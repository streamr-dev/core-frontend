// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './splitControl.pcss'

type Props = {
    className?: string,
    children?: Node,
}

const SplitControl = ({ className, children }: Props) => (
    <div className={cx(styles.root, className)}>
        {children}
    </div>
)

export default SplitControl
