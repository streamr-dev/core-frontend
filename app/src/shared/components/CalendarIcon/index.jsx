// @flow

import React from 'react'
import cx from 'classnames'

import styles from './calendarIcon.pcss'

type Props = {
    className?: string,
}

const CalendarIcon = ({ className }: Props) => (
    <svg
        className={cx(styles.root, className)}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#A3A3A3"
    >
        <g
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x=".75" y="3.75" width="22.5" height="19.5" rx="1.5" />
            <path d="M6.75 6V.75M17.25 6V.75M5.25 14.25h4.5v4.5h-4.5zM14.25 9.75v9M9.75 9.75h9v9h-9zM9.75 14.25h9" />
        </g>
    </svg>
)

export default CalendarIcon
