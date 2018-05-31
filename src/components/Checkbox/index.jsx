// @flow

import React from 'react'
import cx from 'classnames'

import styles from './checkbox.pcss'

export type Props = {
    className?: string,
    value?: any
}

export default function ToggleButton({ value, className, ...props }: Props) {
    return (
        <input
            className={cx(styles.root, {
                className,
                [styles.checked]: value,
            })}
            checked={!!value}
            type="checkbox"
            {...props}
        />
    )
}
