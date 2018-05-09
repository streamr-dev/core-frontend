// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './spinner.pcss'

export type SpinnerSize = 'small' | 'large'

type Props = {
    size?: SpinnerSize,
    className?: string,
}

const Spinner = ({ size, className }: Props) => {
    if (size) {
        return <span className={classNames(className, styles[size], styles.spinner)}>Loading...</span>
    }
    return null
}

export default Spinner
