// @flow

import React from 'react'
import cx from 'classnames'
import { useTransition, animated } from 'react-spring'

import styles from './loadingIndicator.pcss'

type Props = {
    loading?: boolean,
    className?: string
}

const LoadingIndicator = ({ loading, className }: Props) => {
    const transitions = useTransition(!!loading, null, {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    })
    return transitions.map(({ item, key, props }) => (
        item && (
            <animated.div
                key={key}
                style={props}
                className={cx(styles.loadingIndicator, className, {
                    [styles.loading]: loading,
                })}
            />
        )
    ))
}

export default LoadingIndicator
