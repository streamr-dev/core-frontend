// @flow

import React from 'react'
// eslint-disable-next-line import/no-unresolved (Not sure why I'm doing it, fyi. – Mariusz)
import ReactCalendar, { CalendarProps } from 'react-calendar/dist/entry.nostyle'
import moment from 'moment'

import Arrow from '../CalendarArrowIcon'
import styles from './calendar.pcss'

type Props = CalendarProps & {
    initialValue?: Date,
    onChange?: (Date) => void,
}

const formatShortWeekday = (date: Date) => moment(date).format('dd')

const formatMonth = (date: Date) => moment(date).format('MMM')

const Calendar = (props: Props) => (
    <ReactCalendar
        className={styles.calendar}
        minDetail="decade"
        formatShortWeekday={formatShortWeekday}
        formatMonth={formatMonth}
        prevLabel={<Arrow left />}
        nextLabel={<Arrow />}
        {...props}
        next2Label={null}
        prev2Label={null}
    />
)

export default Calendar
