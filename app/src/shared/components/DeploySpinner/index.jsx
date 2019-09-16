// @flow

import React, { useState } from 'react'
import Lottie from 'lottie-react-web'

import useInterval from '$shared/hooks/useInterval'
import spinnerAnimation from '$shared/assets/lottie/deploy-spinner'

import styles from './deploySpinner.pcss'

export type Props = {
    isRunning: boolean,
    showCounter: boolean,
}

const DeploySpinner = ({ isRunning, showCounter }: Props) => {
    const [elapsedSecs, setElapsedSecs] = useState(0)

    useInterval(() => {
        if (isRunning) {
            setElapsedSecs(elapsedSecs + 1)
        }
    }, 1000)

    const toString = (seconds) => {
        const date = new Date(0)
        date.setSeconds(seconds)
        const timeString = date.toISOString().substr(14, 5) // mm:ss
        return timeString
    }

    return (
        <div className={styles.root}>
            <Lottie
                options={{
                    animationData: spinnerAnimation,
                }}
                speed={isRunning ? 1 : 0}
            />
            {showCounter && (
                <div className={styles.counter}>{toString(elapsedSecs)}</div>
            )}
        </div>
    )
}

export default DeploySpinner
