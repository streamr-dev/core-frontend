// @flow

import React from 'react'
// eslint-disable-next-line import/no-unresolved (Not sure why I'm doing it, fyi. – Mariusz)
import ReactCalendar, { CalendarProps } from 'react-calendar/dist/entry.nostyle'
import moment from 'moment'

import styles from './calendar.pcss'

type Props = CalendarProps & {
    initialValue?: Date,
    onChange?: (Date) => void,
}

const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" className={styles.arrow}>
        <g strokeWidth="1.5" stroke="#323232" fill="none" fillRule="evenodd" opacity=".5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1.343L17.657 7 12 12.657M17 7H1" />
        </g>
    </svg>
)

const ArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" className={styles.arrow}>
        <g strokeWidth="1.5" stroke="#323232" fill="none" fillRule="evenodd" opacity=".5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1.343L1.343 7 7 12.657M2 7h16" />
        </g>
    </svg>
)

const formatShortWeekday = (date: Date) => moment(date).format('dd')

const formatMonth = (date: Date) => moment(date).format('MMM')

const Calendar = (props: Props) => (
    <ReactCalendar
        className={styles.calendar}
        minDetail="decade"
        formatShortWeekday={formatShortWeekday}
        formatMonth={formatMonth}
        prevLabel={<ArrowLeft />}
        nextLabel={<ArrowRight />}
        {...props}
        next2Label={null}
        prev2Label={null}
    />
)

export default Calendar
