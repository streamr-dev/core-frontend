// @flow

import React, { Component } from 'react'
import ReactCalendar, { CalendarProps } from 'react-calendar/dist/entry.nostyle'
import moment from 'moment'

import styles from './calendar.pcss'

type Props = CalendarProps & {
    initialValue?: Date,
    onChange?: (Date) => void,
}

type State = {
    value: Date,
}

const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" className={styles.arrow}>
        <g strokeWidth="1.5" stroke="#323232" fill="none" fillRule="evenodd" opacity=".5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1.343L17.657 7 12 12.657M17 7H1" />
        </g>
    </svg>
)

const ArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" className={styles.arrow}>
        <g strokeWidth="1.5" stroke="#323232" fill="none" fillRule="evenodd" opacity=".5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1.343L1.343 7 7 12.657M2 7h16" />
        </g>
    </svg>
)

const formatShortWeekday = (date: Date) => moment(date).format('dd')

const formatMonth = (date: Date) => moment(date).format('MMM')

class Calendar extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            value: props.value || props.initialValue || new Date(),
        }
    }

    componentWillReceiveProps = (props: Props) => {
        if (props.value !== this.props.value) {
            this.setState({
                value: props.value || this.props.value || new Date(),
            })
        }
    }

    onChange = (value: Date) => {
        debugger
        if (!this.props.value) {
            this.setState({
                value,
            })
        } else {
            this.forceUpdate()
        }
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    render() {
        const { value: stateValue } = this.state
        return (
            <ReactCalendar
                className={styles.calendar}
                minDetail="decade"
                formatShortWeekday={formatShortWeekday}
                formatMonth={formatMonth}
                prevLabel={<ArrowLeft />}
                nextLabel={<ArrowRight />}
                next2Label={null}
                prev2Label={null}
                {...this.props}
                onChange={this.onChange}
                value={stateValue || null} // null as backup just in case
            />
        )
    }
}

export default Calendar
