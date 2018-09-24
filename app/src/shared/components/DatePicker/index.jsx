// @flow

import React, { Component } from 'react'
import moment from 'moment'
import classnames from 'classnames'

import Calendar from '../Calendar'
import styles from './datePicker.pcss'

type Props = {
    className?: string,
    closeOnSelect?: boolean,
    dateFormat: string,
    onChange?: (Date) => void,
    style?: {
        [string]: string,
    },
    value?: Date,
}

type State = {
    isOpen: boolean,
    value: ?Date,
}

const TextInput = (props) => <input {...props} />

class DatePicker extends Component<Props, State> {
    static defaultProps = {
        closeOnSelect: true,
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

    onDateChange = (value: Date) => {
        const { closeOnSelect, onChange } = this.props
        if (closeOnSelect) {
            this.closeCalendar()
        }
        this.setState({
            value,
        })
        if (typeof onChange !== 'undefined') {
            onChange(value)
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
            ...props
        } = this.props
        const { isOpen, value: stateValue } = this.state
        const value = propsValue || stateValue
        return (
            <div
                className={classnames(styles.datePicker, className)}
                tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                style={style}
            >
                <TextInput
                    inputRef={(el) => {
                        this.input = el
                    }}
                    tabIndex={-1}
                    {...props}
                    value={value && moment(value).format(dateFormat)}
                />
                {isOpen && (
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
