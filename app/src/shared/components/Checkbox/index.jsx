// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './checkbox.pcss'

export type Props = {
    className?: string,
    value?: any,
    onChange?: (any) => void,
}

const Checkbox = ({ value, className, onChange, ...props }: Props) => (
    <input
        {...props}
        type="checkbox"
        checked={!!value}
        onChange={onChange}
        className={classNames(styles.root, className)}
    />
)

Checkbox.defaultProps = {
    onChange: () => {},
}

export default Checkbox
