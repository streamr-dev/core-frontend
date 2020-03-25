// @flow

import { useState } from 'react'
import useInterval from '$shared/hooks/useInterval'

const HOUR_SECONDS = 60 * 60

const DAY_SECONDS = 24 * HOUR_SECONDS

export const formatRemainingTime = (value: number): string => {
    if (value < DAY_SECONDS) {
        return (new Date(value * 1000)).toISOString().substr(11, 8) // hh:mm:ss
    }

    const days = parseInt(value / DAY_SECONDS, 10)
    return `${days} day${days > 1 ? 's' : ''}`
}

const toSecondsFromNow = (date: Date, now: ?Date) => (
    Math.floor((date.getTime() - (now == null ? new Date() : now).getTime()) / 1000)
)

export default (expiresAt: Date, now?: ?Date) => {
    const [secondsLeft, setSecondsLeft] = useState(toSecondsFromNow(expiresAt, now))

    useInterval(() => {
        setSecondsLeft(Math.max(0, toSecondsFromNow(expiresAt, now)))
    }, 1000)

    return secondsLeft
}
