// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './back.pcss'

export type Props = {
    className?: string,
}

export default ({ className, ...props }: Props) => (
    <button className={classNames(className, 'btn', styles.backButton)} {...props}>
        <BackIcon className={styles.backButtonIcon} /> Back
    </button>
)

function BackIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" {...props}>
            <path fill="none" stroke="#323232" strokeWidth="3" d="M11 18.485L2.515 10 11 1.515" />
        </svg>
    )
}
