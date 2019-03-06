import React, { Fragment } from 'react'
import uuid from 'uuid'

import ModuleSubscription from '../ModuleSubscription'
import { withHover } from '$shared/components/WithHover'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './Scheduler.pcss'

const schedulerOptions = {
    '0': 'hour',
    '1': 'day',
    '2': 'week',
    '3': 'month',
    '4': 'year',
}

const formatDay = (d) => {
    let ending = 'th'

    if (d === 1 || (d >= 20 && d % 10 === 1)) {
        ending = 'st'
    } else if (d === 2 || (d >= 20 && d % 10 === 2)) {
        ending = 'nd'
    } else if (d === 3 || (d >= 20 && d % 10 === 3)) {
        ending = 'rd'
    }

    return `${d}${ending}`
}
const minutes = Array.from(Array(60), (d, i) => i)
const hours = Array.from(Array(24), (d, i) => i)
const weekdays = {
    '2': 'Monday',
    '3': 'Tuesday',
    '4': 'Wednesday',
    '5': 'Thursday',
    '6': 'Friday',
    '7': 'Saturday',
    '1': 'Sunday',
}
const days = Array.from(Array(31), (d, i) => i + 1).reduce((result, d) => ({
    ...result,
    [d]: formatDay(d),
}), {})
const months = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const Select = ({ value, onChange, children }) => (
    <select value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))}>
        {children}
    </select>
)

const MinuteSelect = (props) => (
    <Select {...props}>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{String(minute).padStart(2, '0')}</option>
        ))}
    </Select>
)

const HourSelect = (props) => (
    <Select {...props}>
        {hours.map((hour) => (
            <option key={hour} value={hour}>{String(hour).padStart(2, '0')}</option>
        ))}
    </Select>
)

const WeekdaySelect = (props) => (
    <Select {...props}>
        {Object.keys(weekdays).map((weekday) => (
            <option key={weekday} value={weekday}>{weekdays[weekday]}</option>
        ))}
    </Select>
)

const DaySelect = (props) => (
    <Select {...props}>
        {Object.keys(days).map((day) => (
            <option key={day} value={day}>{days[day]}</option>
        ))}
    </Select>
)
const MonthSelect = (props) => (
    <Select {...props}>
        {Object.keys(months).map((month) => (
            <option key={month} value={month}>{months[month]}</option>
        ))}
    </Select>
)

const HourControl = ({ startDate, endDate, onChange }) => (
    <Fragment>
        From hour+
        <MinuteSelect
            value={startDate.minute}
            onChange={(value) => onChange({
                startDate: { minute: value },
            })}
        />
        To hour+ <MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: { minute: value },
            })}
        />
    </Fragment>
)

const DayControl = ({ startDate, endDate, onChange }) => (
    <Fragment>
        From <HourSelect
            value={startDate.hour}
            onChange={(value) => onChange({
                startDate: {
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            onChange={(value) => onChange({
                startDate: {
                    hour: startDate.hour,
                    minute: value,
                },
            })}
        /><br />
        To <HourSelect
            value={endDate.hour}
            onChange={(value) => onChange({
                endDate: {
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: {
                    hour: startDate.hour,
                    minute: value,
                },
            })}
        />
    </Fragment>
)

const WeekControl = ({ startDate, endDate, onChange }) => (
    <Fragment>
        From <WeekdaySelect
            value={startDate.weekday}
            onChange={(value) => onChange({
                startDate: {
                    weekday: value,
                    hour: startDate.hour,
                    minute: startDate.minute,
                },
            })}
        />
        at <HourSelect
            value={startDate.hour}
            onChange={(value) => onChange({
                startDate: {
                    weekday: startDate.weekday,
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            onChange={(value) => onChange({
                startDate: {
                    weekday: startDate.weekday,
                    hour: startDate.hour,
                    minute: value,
                },
            })}
        /><br />
        To <WeekdaySelect
            value={endDate.weekday}
            onChange={(value) => onChange({
                endDate: {
                    weekday: value,
                    hour: endDate.hour,
                    minute: endDate.minute,
                },
            })}
        />
        at <HourSelect
            value={endDate.hour}
            onChange={(value) => onChange({
                endDate: {
                    weekday: endDate.weekday,
                    hour: value,
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: {
                    weekday: endDate.weekday,
                    hour: endDate.hour,
                    minute: value,
                },
            })}
        />
    </Fragment>
)

const MonthControl = ({ startDate, endDate, onChange }) => (
    <Fragment>
        From <DaySelect
            value={startDate.day}
            onChange={(value) => onChange({
                endDate: {
                    day: value,
                    hour: startDate.hour,
                    minute: startDate.minute,
                },
            })}
        />
        at <HourSelect
            value={startDate.hour}
            onChange={(value) => onChange({
                startDate: {
                    day: startDate.day,
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            onChange={(value) => onChange({
                startDate: {
                    day: startDate.day,
                    hour: startDate.hour,
                    minute: value,
                },
            })}
        /><br />
        To <DaySelect
            value={endDate.day}
            onChange={(value) => onChange({
                endDate: {
                    day: value,
                    hour: endDate.hour,
                    minute: endDate.minute,
                },
            })}
        />
        at <HourSelect
            value={endDate.hour}
            onChange={(value) => onChange({
                endDate: {
                    day: endDate.day,
                    hour: value,
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: {
                    day: endDate.day,
                    hour: endDate.hour,
                    minute: value,
                },
            })}
        />
    </Fragment>
)

const YearControl = ({ startDate, endDate, onChange }) => (
    <Fragment>
        From <DaySelect
            value={startDate.day}
            onChange={(value) => onChange({
                startDate: {
                    month: startDate.month,
                    day: value,
                    hour: startDate.hour,
                    minute: startDate.minute,
                },
            })}
        />
        <MonthSelect
            value={startDate.month}
            onChange={(value) => onChange({
                startDate: {
                    month: value,
                    day: startDate.day,
                    hour: startDate.hour,
                    minute: startDate.minute,
                },
            })}
        />
        at <HourSelect
            value={startDate.hour}
            onChange={(value) => onChange({
                startDate: {
                    month: startDate.month,
                    day: startDate.day,
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            onChange={(value) => onChange({
                startDate: {
                    month: startDate.month,
                    day: startDate.day,
                    hour: startDate.hour,
                    minute: value,
                },
            })}
        /><br />
        To <DaySelect
            value={endDate.day}
            onChange={(value) => onChange({
                endDate: {
                    month: endDate.month,
                    day: value,
                    hour: endDate.hour,
                    minute: endDate.minute,
                },
            })}
        />
        <MonthSelect
            value={endDate.month}
            onChange={(value) => onChange({
                endDate: {
                    month: value,
                    day: endDate.day,
                    hour: endDate.hour,
                    minute: endDate.minute,
                },
            })}
        />
        at <HourSelect
            value={endDate.hour}
            onChange={(value) => onChange({
                endDate: {
                    month: endDate.month,
                    day: endDate.day,
                    hour: value,
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: {
                    month: endDate.month,
                    day: endDate.day,
                    hour: endDate.hour,
                    minute: value,
                },
            })}
        />
    </Fragment>
)

const defaultDates = [
    { // hour
        startDate: { minute: 0 },
        endDate: { minute: 0 },
    },
    { // day
        startDate: {
            hour: 0,
            minute: 0,
        },
        endDate: {
            hour: 0,
            minute: 0,
        },
    },
    { // week
        startDate: {
            weekday: 1,
            hour: 0,
            minute: 0,
        },
        endDate: {
            weekday: 1,
            hour: 0,
            minute: 0,
        },
    },
    { // month
        startDate: {
            day: 1,
            hour: 0,
            minute: 0,
        },
        endDate: {
            day: 1,
            hour: 0,
            minute: 0,
        },
    },
    { // year
        startDate: {
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
        },
        endDate: {
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
        },
    },
]

const Rule = withHover(class RuleComponent extends React.Component {
    onRemove = () => {
        const { onRemove, rule } = this.props

        if (onRemove) {
            onRemove(rule.id)
        }
    }

    onIntervalChange = (e) => {
        const intervalType = parseInt(e.target.value, 10)
        this.props.onChange(this.props.rule.id, {
            intervalType,
            ...(defaultDates[intervalType] || {}),
        })
    }

    onUpdateDates = (properties) => {
        this.props.onChange(this.props.rule.id, {
            ...properties,
        })
    }

    render() {
        const { isHovered, rule } = this.props

        return (
            <div className={styles.ruleContainer}>
                {isHovered && (
                    <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        onClick={this.onRemove}
                        className={styles.removeButton}
                    >
                        <SvgIcon name="crossHeavy" className={styles.removeIcon} />
                    </div>
                )}
                Send value
                <input type="text" />
                <br />
                Every
                <select value={rule.intervalType} onChange={this.onIntervalChange}>
                    {Object.keys(schedulerOptions).map((value) => (
                        <option key={value} value={value}>{schedulerOptions[value]}</option>
                    ))}
                </select>
                <br />
                {rule.intervalType === 0 && (
                    <HourControl onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === 1 && (
                    <DayControl onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === 2 && (
                    <WeekControl onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === 3 && (
                    <MonthControl onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === 4 && (
                    <YearControl onChange={this.onUpdateDates} {...rule} />
                )}
            </div>
        )
    }
})

const defaultRule = {
    intervalType: 0,
    value: 0,
    endDate: {
        minute: 1,
    },
    startDate: {
        minute: 0,
    },
}

const addRule = (rules, id = uuid()) => ([
    ...rules,
    {
        id,
        ...defaultRule,
    },
])

const removeRule = (rules, id) => rules.filter((rule) => rule.id !== id)

const changeRule = (rules, id, properties) => rules.map((r) => {
    if (r.id === id) {
        return {
            ...r,
            ...properties,
        }
    }

    return r
})

export default class SchedulerModule extends React.Component {
    subscription = React.createRef()

    state = {
        defaultValue: undefined,
        rules: undefined,
    }

    static getDerivedStateFromProps(props, state) {
        if (state.rules) {
            return null
        }

        const { rules, defaultValue } = props.module.schedule || {}

        // Add default row when module is added to canvas
        const existingRules = rules || []
        const defaultRules = (!existingRules.length && !state.rules) ? [{
            ...defaultRule,
        }] : existingRules

        // Map existing rules with an id
        return {
            defaultValue: defaultValue || 0,
            rules: defaultRules.map((rule) => ({
                ...rule,
                id: rule.id || uuid(),
            })),
        }
    }

    onAddRule = () => {
        this.setState((prevState) => ({
            rules: addRule(prevState.rules),
        }), this.updateStateToModule)
    }

    onRemoveRule = (id) => {
        this.setState((prevState) => ({
            rules: removeRule(prevState.rules, id),
        }), this.updateStateToModule)
    }

    onChangeRule = (id, properties) => {
        this.setState((prevState) => ({
            rules: changeRule(prevState.rules, id, properties),
        }), this.updateStateToModule)
    }

    updateStateToModule = () => {
        this.props.api.updateModule(this.props.moduleHash, {
            schedule: {
                ...this.state,
            },
        })
    }

    render() {
        const { module } = this.props
        const { rules } = this.state

        return (
            <div>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                />
                <div>
                    {rules.map((rule) => (
                        <Rule
                            key={rule.id}
                            onChange={this.onChangeRule}
                            onRemove={this.onRemoveRule}
                            rule={rule}
                        />
                    ))}
                </div>
                <div className={styles.addButtonContainer}>
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={this.onAddRule}
                    >
                        + Add
                    </button>
                </div>
            </div>
        )
    }
}
