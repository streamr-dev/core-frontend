// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './tile.pcss'

type Props = {
    children?: Node,
    className?: string,
}

export const Title = ({ children, className }: Props) => (
    <div className={cx(styles.title, className)}>{children}</div>
)

export const Description = ({ children, className }: Props) => (
    <div className={cx(styles.description, className)}>{children}</div>
)

export const Status = ({ children, className }: Props) => (
    <div className={cx(styles.status, className)}>{children}</div>
)

export const Tag = ({ children, className }: Props) => (
    <div className={cx(styles.tag, className)}>{children}</div>
)
