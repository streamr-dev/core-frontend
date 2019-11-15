// @flow

import React from 'react'
import classNames from 'classnames'
import { Translate } from 'react-redux-i18n'

import styles from './spinner.pcss'

export type SpinnerSize = 'small' | 'large'
export type SpinnerColor = 'green' | 'white'

type Props = {
    size?: SpinnerSize,
    color?: SpinnerColor,
    className?: string,
}

const Spinner = ({ size, color, className }: Props) => (
    <div className={styles.container}>
        <span className={classNames(className, styles[size], styles.spinner, styles[color])} />
        <Translate className={styles.screenReaderText} value="spinner.screenReaderText" />
    </div>
)

Spinner.defaultProps = {
    size: 'small',
    color: 'green',
}

export default Spinner
