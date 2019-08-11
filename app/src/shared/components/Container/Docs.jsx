// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './docs.pcss'

type Props = {
    className?: string,
    children?: Node,
}

const Docs = ({ className, children, ...props }: Props) => (
    <div className={cx(styles.root, styles.DocsContainer, className)} {...props}>
        {children}
    </div>
)

export default Docs
