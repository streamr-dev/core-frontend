// @flow

import React from 'react'
import cx from 'classnames'

import styles from './meatball.pcss'

type Props = {
    alt: string,
    blue?: boolean,
    gray?: boolean,
    white?: boolean,
    disabled?: boolean,
}

const Meatball = ({
    alt,
    blue,
    gray,
    white,
    disabled,
}: Props) => (
    <div
        className={cx(styles.root, {
            [styles.blue]: !!blue,
            [styles.gray]: !!gray,
            [styles.white]: !!white,
            [styles.disabled]: !!disabled,
        })}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="4"
            alt={alt}
        >
            <circle cx="2" cy="2" r="2" />
            <circle cx="10" cy="2" r="2" />
            <circle cx="18" cy="2" r="2" />
        </svg>
    </div>
)

export default Meatball
