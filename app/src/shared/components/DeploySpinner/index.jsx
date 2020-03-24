// @flow

import React, { useState } from 'react'
import cx from 'classnames'

import useInterval from '$shared/hooks/useInterval'

import styles from './deploySpinner.pcss'

/* eslint-disable max-len */
const SpinnerSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        style={{
            width: '100%',
            height: '100%',
        }}
    >
        <defs>
            <clipPath id="a">
                <path d="M0 0h500v500H0z" />
            </clipPath>
            <clipPath id="b">
                <path d="M0 0h500v500H0z" />
            </clipPath>
            <clipPath id="e">
                <path d="M0 0h500v500H0z" />
            </clipPath>
            <clipPath id="d">
                <path d="M0 0h500v500H0z" />
            </clipPath>
            <clipPath id="c">
                <path d="M0 0h500v500H0z" />
            </clipPath>
        </defs>
        <g clipPath="url(#a)">
            <g
                fill="none"
                clipPath="url(#b)"
                display="block"
                transform="matrix(1.5 0 0 1.5 -125 -125)"
            >
                <g
                    className={styles.circle}
                    clipPath="url(#c)"
                    display="block"
                    transform="rotate(180 250 250)"
                >
                    <g display="block">
                        <path d="M250 88.953c-88.944 0-161.048 72.104-161.048 161.047S161.056 411.048 250 411.048c88.943 0 161.047-72.105 161.047-161.048S338.943 88.953 250 88.953z" />
                        <path
                            stroke="#E7E7E7"
                            strokeWidth="7.757"
                            d="M250 88.953c-88.944 0-161.048 72.104-161.048 161.047S161.056 411.048 250 411.048c88.943 0 161.047-72.105 161.047-161.048S338.943 88.953 250 88.953z"
                        />
                    </g>
                    <g display="block">
                        <path d="M250 88.953c-88.944 0-161.048 72.104-161.048 161.047S161.056 411.048 250 411.048c88.943 0 161.047-72.105 161.047-161.048" />
                        <path
                            stroke="#0324FF"
                            strokeLinecap="round"
                            strokeWidth="7.757"
                            d="M250 88.953c-88.944 0-161.048 72.104-161.048 161.047S161.056 411.048 250 411.048c88.943 0 161.047-72.105 161.047-161.048"
                        />
                    </g>
                </g>
                <g
                    className={styles.circle}
                    clipPath="url(#d)"
                    display="block"
                    transform="rotate(0 250 250)"
                >
                    <g display="block">
                        <path d="M250 131.664c-65.717 0-118.993 53.276-118.993 118.994 0 65.717 53.276 118.993 118.993 118.993 65.718 0 118.994-53.276 118.994-118.993 0-65.718-53.276-118.994-118.994-118.994z" />
                        <path
                            stroke="#E7E7E7"
                            strokeWidth="7.881"
                            d="M250 131.664c-65.717 0-118.993 53.276-118.993 118.994 0 65.717 53.276 118.993 118.993 118.993 65.718 0 118.994-53.276 118.994-118.993 0-65.718-53.276-118.994-118.994-118.994z"
                        />
                    </g>
                    <g display="block">
                        <path d="M250 130.93c-65.76 0-119.07 53.31-119.07 119.07 0 65.76 53.31 119.07 119.07 119.07 65.76 0 119.07-53.31 119.07-119.07" />
                        <path
                            stroke="#0324FF"
                            strokeLinecap="round"
                            strokeWidth="7.886"
                            d="M250 130.93c-65.76 0-119.07 53.31-119.07 119.07 0 65.76 53.31 119.07 119.07 119.07 65.76 0 119.07-53.31 119.07-119.07"
                        />
                    </g>
                </g>
                <g
                    className={styles.circle}
                    clipPath="url(#e)"
                    display="block"
                    transform="rotate(-90 250 250)"
                >
                    <g display="block">
                        <path d="M250 174.128c-41.903 0-75.873 33.97-75.873 75.872 0 41.903 33.97 75.873 75.873 75.873 41.903 0 75.873-33.97 75.873-75.873 0-41.902-33.97-75.872-75.873-75.872z" />
                        <path
                            stroke="#E7E7E7"
                            strokeWidth="7.309"
                            d="M250 174.128c-41.903 0-75.873 33.97-75.873 75.872 0 41.903 33.97 75.873 75.873 75.873 41.903 0 75.873-33.97 75.873-75.873 0-41.902-33.97-75.872-75.873-75.872z"
                        />
                    </g>
                    <g display="block">
                        <path d="M250 173.915c-42.02 0-76.085 34.065-76.085 76.085 0 42.02 34.065 76.085 76.085 76.085 42.02 0 76.085-34.065 76.085-76.085" />
                        <path
                            stroke="#0324FF"
                            strokeLinecap="round"
                            strokeWidth="7.33"
                            d="M250 173.915c-42.02 0-76.085 34.065-76.085 76.085 0 42.02 34.065 76.085 76.085 76.085 42.02 0 76.085-34.065 76.085-76.085"
                        />
                    </g>
                </g>
            </g>
        </g>
    </svg>
)
/* eslint-enable max-len */

export type Props = {
    isRunning: boolean,
    showCounter: boolean,
}

const DeploySpinner = ({ isRunning, showCounter }: Props) => {
    const [elapsedSecs, setElapsedSecs] = useState(0)

    useInterval(() => {
        setElapsedSecs(elapsedSecs + 1)
    }, isRunning ? 1000 : null)

    const toString = (seconds) => {
        const date = new Date(0)
        date.setSeconds(seconds)
        const timeString = date.toISOString().substr(14, 5) // mm:ss
        return timeString
    }

    return (
        <div
            className={cx(styles.root, {
                [styles.isRunning]: !!isRunning,
            })}
        >
            <SpinnerSvg />
            {showCounter && (
                <div className={styles.counter}>{toString(elapsedSecs)}</div>
            )}
        </div>
    )
}

export default DeploySpinner
