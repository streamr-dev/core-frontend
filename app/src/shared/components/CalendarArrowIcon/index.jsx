// @flow

import React from 'react'
import styles from './calendarArrowIcon.pcss'

type Props = {
    left?: boolean,
}

const CalendarArrowIcon = ({ left }: Props) => (
    <svg className={styles.root} xmlns="http://www.w3.org/2000/svg" width="19" height="14">
        <g strokeWidth="1.5" stroke="#323232" fill="none" fillRule="evenodd" opacity=".5" strokeLinecap="round" strokeLinejoin="round">
            {left ? (
                <path d="M7 1.343L1.343 7 7 12.657M2 7h16" />
            ) : (
                <path d="M12 1.343L17.657 7 12 12.657M17 7H1" />
            )}
        </g>
    </svg>
)

export default CalendarArrowIcon
