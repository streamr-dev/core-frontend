// @flow

import React from 'react'
import classNames from 'classnames'
import { Translate } from 'streamr-layout/dist/bundle'

import styles from './spinner.pcss'

export type SpinnerSize = 'small' | 'large'
export type SpinnerColor = 'green' | 'white'

type Props = {
    size?: SpinnerSize,
    color?: SpinnerColor,
    className?: string,
}

const Spinner = ({ size, color, className }: Props) => (
    <span className={classNames(className, styles[size], styles.spinner, styles[color])}>
        <Translate value="spinner.screenReaderText" />
    </span>
)

Spinner.defaultProps = {
    size: 'small',
    color: 'green',
}

export default Spinner
