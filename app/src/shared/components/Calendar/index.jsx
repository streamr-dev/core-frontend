// @flow

import React from 'react'
import ReactCalendar, { CalendarProps } from 'react-calendar/dist/entry.nostyle'

import dateFormatter from '$utils/dateFormatter'
import Arrow from '../CalendarArrowIcon'
import styles from './calendar.pcss'

type Props = CalendarProps & {
    onChange?: (Date) => void,
}

const Calendar = (props: Props) => (
    <ReactCalendar
        className={styles.calendar}
        minDetail="decade"
        formatShortWeekday={dateFormatter('dd')}
        formatMonth={dateFormatter('MMM')}
        prevLabel={<Arrow left />}
        nextLabel={<Arrow />}
        {...props}
        next2Label={null}
        prev2Label={null}
    />
)

export default Calendar
