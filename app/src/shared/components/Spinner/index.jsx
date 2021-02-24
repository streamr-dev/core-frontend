// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './spinner.pcss'

export type SpinnerSize = 'small' | 'large'
export type SpinnerColor = 'green' | 'white' | 'gray' | 'blue'

type Props = {
    size?: SpinnerSize,
    color?: SpinnerColor,
    className?: string,
    containerClassname?: string,
}

const Spinner = ({ size, color, className, containerClassname }: Props) => (
    <div className={classNames(styles.container, containerClassname)}>
        <span className={classNames(className, styles[size], styles.spinner, styles[color])} />
        <span className={styles.screenReaderText}>
            Loading...
        </span>
    </div>
)

Spinner.defaultProps = {
    size: 'small',
    color: 'green',
}

export default Spinner
