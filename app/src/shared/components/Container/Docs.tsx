import { ReactNode } from 'react'
import React from 'react'
import cx from 'classnames'
import styles from './docs.pcss'
type Props = {
    className?: string
    children?: ReactNode
}

const Docs = ({ className, children, ...props }: Props) => (
    <div {...props} className={cx(styles.root, styles.DocsContainer, className)}>
        {children}
    </div>
)

export default Docs
