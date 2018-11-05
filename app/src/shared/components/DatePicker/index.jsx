// @flow

import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import { isMobile as checkMobile } from '$shared/utils/platform'

import Calendar from '../Calendar'
import CalendarIcon from '../CalendarIcon'
import dateFormatter from '$utils/dateFormatter'
import styles from './datePicker.pcss'

type Props = {
    className?: string,
    closeOnSelect?: boolean,
    dateFormat: string,
    onChange?: (Date) => void,
    inputClass?: string,
    value?: Date,
}

type State = {
    isOpen: boolean,
    value: ?Date,
}

const TextInput = ({ inputRef, ...props }) => <input {...props} />

const isMobile = checkMobile()
const ISO_DATE_FORMAT = 'YYYY-MM-DD'

class DatePicker extends Component<Props, State> {
    static defaultProps = {
        closeOnSelect: !isMobile,
        dateFormat: 'DD MMMM YYYY',
    }

    state = {
        isOpen: false,
        value: null,
    }

    // from https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
    onBlur = (e: SyntheticEvent<HTMLInputElement>) => {
        const { currentTarget } = e

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                this.closeCalendar()
            }
        }, 0)
    }

    onDateInputChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.onDateChange(e.target.value)
    }

    onDateChange = (value: Date | string) => {
        const { closeOnSelect, onChange } = this.props
        if (closeOnSelect) {
            this.closeCalendar()
        }
        const date = value instanceof Date ? value : new Date(value)
        this.setState({
            value: date,
        })
        if (onChange) {
            onChange(date)
        }
    }

    setInput = (input: ?HTMLInputElement) => {
        this.input = input
    }

    openCalendar = () => {
        this.setState({
            isOpen: true,
        })
        if (this.input) {
            this.input.focus()
        }
    }

    closeCalendar = () => {
        this.setState({
            isOpen: false,
        })
        if (this.input) {
            this.input.blur()
        }
    }

    input: ?HTMLInputElement = null

    render() {
        const {
            className,
            dateFormat,
            value: propsValue,
            inputClass,
            closeOnSelect,
            ...props
        } = this.props
        const { isOpen, value: stateValue } = this.state
        const value = propsValue || stateValue

        return (
            <div
                className={cx(styles.datePicker, className, {
                    [styles.open]: isOpen,
                })}
                tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                onFocus={this.openCalendar}
                onBlur={this.onBlur}
            >
                <Fragment>
                    <TextInput
                        inputRef={this.setInput}
                        tabIndex={-1}
                        {...props}
                        className={cx(inputClass, styles.input)}
                        value={dateFormatter(isMobile ? ISO_DATE_FORMAT : dateFormat)(value)}
                        onChange={this.onDateInputChange}
                        type={isMobile ? 'date' : 'text'}
                    />
                    <CalendarIcon className={styles.calendarIcon} />
                </Fragment>
                {!isMobile && isOpen && (
                    <div className={styles.calendarContainer}>
                        <Calendar
                            onChange={this.onDateChange}
                            value={value}
                        />
                    </div>
                )}

            </div>
        )
    }
}

export default DatePicker
