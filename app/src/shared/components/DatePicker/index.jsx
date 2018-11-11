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

class DatePicker extends React.Component<Props> {
    static defaultProps = {
        closeOnSelect: !isMobile,
        format: 'DD MMMM YYYY',
    }

    onChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { onChange } = this.props
        const { value } = e.target

        if (isMobile && onChange && /^\d{4}(-\d+){0,2}$/.test(value)) {
            onChange(new Date(value))
        }
    }

    render() {
        const { label, format, ...props } = this.props

        return (
            <FormControl
                label={label}
                {...props}
            >
                {({ value, onFocusChange, setAutoCompleted, ...rest0 }: InnerProps) => (
                    <WithCalendar {...rest0} disabled={isMobile}>
                        {({ date, toggleCalendar, ...rest1 }) => (
                            <React.Fragment>
                                <TextField
                                    type={isMobile ? 'date' : 'text'}
                                    value={dateFormatter(isMobile ? ISO_DATE_FORMAT : (format || ISO_DATE_FORMAT))(value) || ''}
                                    onBlur={onFocusChange}
                                    onFocus={onFocusChange}
                                    onAutoComplete={setAutoCompleted}
                                    onChange={this.onChange}
                                    {...rest1}
                                />
                                <CalendarIcon />
                            </React.Fragment>
                        )}
                    </WithCalendar>
                )}
            </FormControl>
        )
    }
}

export default DatePicker
