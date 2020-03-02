// @flow

import React, { useState } from 'react'
import cx from 'classnames'

import useInterval from '$shared/hooks/useInterval'

import styles from './expirationCounter.pcss'

type Props = {
    expiresAt: Date,
    now?: ?Date,
    className?: string,
}

const HOUR_SECONDS = 60 * 60
const DAY_SECONDS = 24 * HOUR_SECONDS

const getExpirationString = (secondsLeft: number): string => {
    if (secondsLeft < DAY_SECONDS) {
        const date = new Date(0)
        date.setTime(secondsLeft * 1000)
        return date.toISOString().substr(11, 8) // hh:mm:ss
    }

    const days = parseInt(secondsLeft / DAY_SECONDS, 10)
    return `${days} day${days > 1 ? 's' : ''}`
}

const toSecondsFromNow = (data: Date, now: ?Date) => (
    Number.parseInt((data.getTime() - (typeof now === 'undefined' ? Date.now() : now)) / 1000, 10)
)

const ExpirationCounter = ({ expiresAt, now, className }: Props) => {
    const [secondsUntilExpiration, setSecondsUntilExpiration] = useState(toSecondsFromNow(expiresAt, now))

    useInterval(() => {
        setSecondsUntilExpiration(toSecondsFromNow(expiresAt, now))
    }, 1000)

    return (
        <span className={
            cx(
                styles.root,
                className, {
                    [styles.expiringSoon]: secondsUntilExpiration > 0 && secondsUntilExpiration <= HOUR_SECONDS,
                    [styles.expired]: secondsUntilExpiration < 0,
                },
            )}
        >
            {secondsUntilExpiration <= 0 ? 'Expired' : (
                `Expires in ${getExpirationString(secondsUntilExpiration)}`
            )}
        </span>
    )
}

export default ExpirationCounter
