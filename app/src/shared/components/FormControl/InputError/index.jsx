// @flow

import React from 'react'
import cx from 'classnames'

import styles from './inputError.pcss'

type Props = {
    eligible?: boolean,
    message: ?string,
    preserved?: boolean,
    className?: string,
}

const InputError = ({ message, eligible, preserved, className }: Props) => {
    const msg = eligible && message ? message : null

    return (preserved || msg) && (
        <div className={cx(styles.root, className)}>
            {eligible && message ? message : null}
        </div>
    )
}

export default InputError
