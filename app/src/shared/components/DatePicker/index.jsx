// @flow

import React, { Component, Fragment } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { isMobile as checkMobile } from '$shared/utils/platform'

import Calendar from '../Calendar'
import styles from './datePicker.pcss'

const CalendarIcon = ({ className }: { className: string }) => (
    <svg className={className} width="24" height="24" xmlns="http://www.w3.org/2000/svg" stroke="#A3A3A3">
        <g
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x=".75" y="3.75" width="22.5" height="19.5" rx="1.5" />
            <path d="M6.75 6V.75M17.25 6V.75M5.25 14.25h4.5v4.5h-4.5zM14.25 9.75v9M9.75 9.75h9v9h-9zM9.75 14.25h9" />
        </g>
    </svg>
)

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
