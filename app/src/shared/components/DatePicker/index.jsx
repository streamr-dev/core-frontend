// @flow

import React from 'react'

import { isMobile as checkMobile } from '$shared/utils/platform'
import FormControl, { type FormControlProps, type InputProps } from '../FormControl'
import WithCalendar, { type WithCalendarProps } from '../WithCalendar'
import CalendarIcon from '../CalendarIcon'
import TextField from '../TextField'
import dateFormatter from '$utils/dateFormatter'

type Props = FormControlProps & WithCalendarProps & {
    format?: string,
    onChange?: (Date) => void,
    value?: Date,
}

type InnerProps = InputProps & {
    value: ?Date,
}

const isMobile = checkMobile()
const ISO_DATE_FORMAT = 'YYYY-MM-DD'

const DatePicker = ({ label, format, ...props }: Props) => (
    <FormControl
        label={label}
        {...props}
    >
        {({ value, onFocusChange, setAutoCompleted, ...rest0 }: InnerProps) => (
            <WithCalendar {...rest0}>
                {({ date, toggleCalendar, ...rest1 }) => (
                    <React.Fragment>
                        <TextField
                            type={isMobile ? 'date' : 'text'}
                            value={dateFormatter(isMobile ? ISO_DATE_FORMAT : (format || ISO_DATE_FORMAT))(value) || ''}
                            onBlur={onFocusChange}
                            onFocus={onFocusChange}
                            onAutoComplete={setAutoCompleted}
                            {...rest1}
                        />
                        <CalendarIcon />
                    </React.Fragment>
                )}
            </WithCalendar>
        )}
    </FormControl>
)

DatePicker.defaultProps = {
    closeOnSelect: !isMobile,
    format: 'DD MMMM YYYY',
}

export default DatePicker
