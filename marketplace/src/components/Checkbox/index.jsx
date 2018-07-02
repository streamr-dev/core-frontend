// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './checkbox.pcss'

export type Props = {
    className?: string,
    value?: any
}

export default function ToggleButton({ value, className, ...props }: Props) {
    return (
        <input
            type="checkbox"
            checked={!!value}
            className={classNames(styles.root, className)}
            {...props}
        />
    )
}
