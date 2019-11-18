// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './details.pcss'

type BaseProps = {
    children?: Node,
    className?: string,
}

type Props = BaseProps & {
    label: string,
}

export const Row = ({ label, className, children }: Props) => (
    <div className={cx(styles.row, className)}>
        <div>{label}</div>
        <div>{children}</div>
    </div>
)

export const Details = ({ children, className }: BaseProps) => (
    <div className={cx(styles.details, className)}>
        {children || null}
    </div>
)

Details.Row = Row

export default Details
