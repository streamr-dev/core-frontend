// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import styles from './bar.pcss'

type Props = {
    className?: ?string,
    left?: Node,
    right?: Node,
}

const MobileBar = ({ className, left, right }: Props) => (
    <div className={cx(styles.root, className)}>
        <div>
            {left}
        </div>
        <div>
            {right}
        </div>
    </div>
)

export default MobileBar
