// @flow

import React from 'react'
import cx from 'classnames'

import styles from './loadingIndicator.pcss'

type Props = {
    loading: boolean,
    className?: string
}

const LoadingIndicator = (props: Props) => (
    <div
        className={cx(styles.loadingIndicator, props.className, {
            [styles.loading]: props.loading,
        })}
    />
)

export default LoadingIndicator
