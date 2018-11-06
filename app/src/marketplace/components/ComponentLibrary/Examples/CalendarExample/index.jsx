// @flow

import React from 'react'

import withCalendar from '$shared/containers/WithCalendar'
import dateFormatter from '$utils/dateFormatter'

type Props = {
    date: Date,
    toggleCalendar: () => void,
}

const CalendarExample = ({ date, toggleCalendar }: Props) => (
    <button type="button" onClick={toggleCalendar}>
        {dateFormatter('DD MMMM YYYY')(date)}
    </button>
)

export default withCalendar(CalendarExample)
