import React, { FunctionComponent, ReactNode } from 'react'
import cx from 'classnames'
import styles from './splitControl.pcss'

type Props = {
    className?: string
    children?: ReactNode
}

const SplitControl: FunctionComponent = ({ className, children }: Props) => <div className={cx(styles.root, className)}>{children}</div>

export default SplitControl
