// @flow

import React from 'react'

import WithCalendar from '$shared/components/WithCalendar'
import dateFormatter from '$utils/dateFormatter'

const CalendarExample = () => (
    <WithCalendar>
        {({ toggleCalendar, date }) => (
            <button type="button" onClick={toggleCalendar}>
                {dateFormatter('DD MMMM YYYY')(date)}
            </button>
        )}
    </WithCalendar>
)

export default CalendarExample
