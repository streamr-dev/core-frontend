// @flow

import React, { Component, Fragment } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { isMobile as checkMobile } from '$shared/utils/platform'

import Calendar from '../Calendar'
import CalendarIcon from '../CalendarIcon'
import styles from './datePicker.pcss'

type Props = {
    className?: string,
    closeOnSelect?: boolean,
    dateFormat: string,
    onChange?: (Date) => void,
    style?: {
        [string]: string,
    },
    inputClass?: string,
    value?: Date,
}

type State = {
    isOpen: boolean,
    value: ?Date,
}

const TextInput = (props) => <input {...props} />

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

    onFocus = () => {
        this.openCalendar()
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

    onDateChange = (value: Date | string) => {
        const { closeOnSelect, onChange } = this.props
        if (closeOnSelect) {
            this.closeCalendar()
        }
        const date = value instanceof Date ? value : new Date(value)
        this.setState({
            value: date,
        })
        if (typeof onChange !== 'undefined') {
            onChange(date)
        }
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
            closeOnSelect,
            dateFormat,
            onChange,
            style,
            value: propsValue,
            inputClass,
            ...props
        } = this.props
        const { isOpen, value: stateValue } = this.state
        const value = propsValue || stateValue
        return (
            <div
                className={classnames(styles.datePicker, className, {
                    [styles.open]: isOpen,
                })}
                tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                style={style}
            >
                {isMobile ? (
                    <Fragment>
                        <TextInput
                            inputRef={(el) => {
                                this.input = el
                            }}
                            tabIndex={-1}
                            {...props}
                            className={classnames(inputClass, styles.input)}
                            value={value && moment(value).format(ISO_DATE_FORMAT)}
                            type="date"
                            onChange={this.onDateChange}
                        />
                        <CalendarIcon className={styles.calendarIcon} />
                    </Fragment>
                ) : (
                    <Fragment>
                        <TextInput
                            inputRef={(el) => {
                                this.input = el
                            }}
                            tabIndex={-1}
                            {...props}
                            className={classnames(inputClass, styles.input)}
                            value={value && moment(value).format(dateFormat)}
                        />
                        <CalendarIcon className={styles.calendarIcon} />
                        {isOpen && (
                            <div className={styles.calendarContainer}>
                                <Calendar
                                    onChange={this.onDateChange}
                                    value={value}
                                />
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        )
    }
}

export default DatePicker
