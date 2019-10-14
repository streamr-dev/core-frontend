// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Badge from './Badge'

import styles from './label.pcss'

type Props = {
    children?: Node,
    topLeft?: boolean,
    bottomRight?: boolean,
    className?: string,
}

export const Label = ({ children, topLeft, bottomRight, className }: Props) => (
    <div
        className={cx(styles.Label, {
            [styles.topLeft]: !!topLeft,
            [styles.bottomRight]: !!bottomRight,
        }, className)}
    >
        {children}
    </div>
)

Label.Badge = Badge

export default Label
