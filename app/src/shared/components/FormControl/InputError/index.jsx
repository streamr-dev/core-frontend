// @flow

import React from 'react'
import styles from './inputError.pcss'

type Props = {
    eligible?: boolean,
    message: ?string,
    preserved?: boolean,
}

const InputError = ({ message, eligible, preserved }: Props) => {
    const msg = eligible && message ? message : null

    return (preserved || msg) && (
        <div className={styles.root}>
            {eligible && message ? message : null}
        </div>
    )
}

export default InputError
