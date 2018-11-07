// @flow

import React from 'react'

import { isMobile as checkMobile } from '$shared/utils/platform'
import withCalendar, { type Props as WithCalendarProps } from '$shared/containers/WithCalendar'
import CalendarIcon from '../CalendarIcon'
import TextInput from '../TextInput'
import dateFormatter from '$utils/dateFormatter'
// import styles from './datePicker.pcss'

type Props = WithCalendarProps & {
    format?: string,
    onChange?: (Date) => void,
    value?: Date,
    date: Date,
}

const isMobile = checkMobile()
const ISO_DATE_FORMAT = 'YYYY-MM-DD'

class DatePicker extends React.Component<Props> {
    static defaultProps = {
        closeOnSelect: !isMobile,
        format: 'DD MMMM YYYY',
    }

    onChange = () => {}

    render() {
        const { date, format } = this.props

        return (
            <React.Fragment>
                <TextInput
                    label="Date"
                    value={dateFormatter(isMobile ? ISO_DATE_FORMAT : (format || ISO_DATE_FORMAT))(date) || ''}
                    onChange={this.onChange}
                    type={isMobile ? 'date' : 'text'}
                />
                <CalendarIcon />
            </React.Fragment>
        )
    }
}

export default withCalendar(DatePicker)
