// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import styles from './moduleHeaderButton.pcss'

type Props = {
    children: Node,
    className?: ?string,
}

const ModuleHeaderButton = ({ children, className, ...props }: Props) => (
    <button
        className={cx(styles.root, className)}
        type="button"
        {...props}
    >
        {children}
    </button>
)

export default ModuleHeaderButton
