// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import { isMobile as checkMobile } from '$shared/utils/platform'
import WithCalendar, { type WithCalendarProps } from './WithCalendar'
import CalendarIcon from './CalendarIcon'
import CoreText from '$shared/components/Input/CoreText'
import dateFormatter from '$utils/dateFormatter'

type Props = WithCalendarProps & {
    format?: string,
    onChange?: (Date) => void,
    value?: Date | string,
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

        if (isMobile && onChange) {
            onChange(new Date(value))
        }
    }

    render() {
        // $FlowFixMe `value` is not in `WithCalendarProps` #fml.
        const { value, format, ...props } = this.props

        return (
            <WithCalendar {...props} disabled={isMobile}>
                {({ date, toggleCalendar, ...rest1 }) => (
                    <React.Fragment>
                        <CoreText
                            type={isMobile ? 'date' : 'text'}
                            value={value === I18n.t('userpages.streams.edit.history.datePicker.selectDate') ?
                                I18n.t('userpages.streams.edit.history.datePicker.selectDate') :
                                dateFormatter(isMobile ? ISO_DATE_FORMAT : (format || ISO_DATE_FORMAT))(value) || ''}
                            onChange={this.onChange}
                            {...rest1}
                        />
                        <CalendarIcon />
                    </React.Fragment>
                )}
            </WithCalendar>
        )
    }
}

export default DatePicker
