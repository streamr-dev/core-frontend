// @flow

import React from 'react'
import ReactCalendar, { CalendarProps } from 'react-calendar/dist/entry.nostyle'

import dateFormatter from '$utils/dateFormatter'
import Arrow from '../CalendarArrowIcon'
import styles from './calendar.pcss'

type Props = CalendarProps & {
    onChange?: (Date) => void,
}

// wrap format functions as react-calendar now passes locale as first param
const formatShortWeekday = (() => {
    const fn = dateFormatter('dd')
    return (locale, ...args) => fn(...args)
})()

const formatMonth = (() => {
    const fn = dateFormatter('MMM')
    return (locale, ...args) => fn(...args)
})()

const prevLabel = <Arrow left />
const nextLabel = <Arrow />

const Calendar = (props: Props) => (
    <ReactCalendar
        className={styles.calendar}
        minDetail="decade"
        formatShortWeekday={formatShortWeekday}
        formatMonth={formatMonth}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        {...props}
        next2Label={null}
        prev2Label={null}
    />
)

export default Calendar
