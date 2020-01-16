// @flow

import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'
import { useTransition, animated } from 'react-spring'
import { useDebounced } from '$shared/hooks/wrapCallback'

import styles from './loadingIndicator.pcss'

type Props = {
    loading?: boolean,
    className?: ?string
}

const LoadingIndicator = ({ loading, className }: Props) => {
    loading = !!loading
    const [loadingState, setLoadingState] = useState(loading)

    // debounce loading flag changes to avoid flickering loading indicator
    const updateLoading = useDebounced(useCallback((value) => {
        setLoadingState(value)
    }, []), 1000)

    useEffect(() => {
        updateLoading(loading)
    }, [loading, setLoadingState, updateLoading])

    const transitions = useTransition(loadingState, null, {
        config: {
            tension: 500,
            friction: 50,
            clamp: true,
        },
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
                    [styles.loading]: loadingState,
                })}
            />
        )
    ))
}

export default LoadingIndicator
