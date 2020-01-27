import React, { Fragment } from 'react'
import uuid from 'uuid'
import { arrayMove } from 'react-sortable-hoc'

import SortableList from '$shared/components/SortableList'
import { withHover } from '$shared/components/WithHover'
import SvgIcon from '$shared/components/SvgIcon'
import Text from '$ui/Text'

import styles from './Scheduler.pcss'

const IntervalTypes = {
    HOUR: 0,
    DAY: 1,
    WEEK: 2,
    MONTH: 3,
    YEAR: 4,
}
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

const Select = ({
    disabled,
    value,
    onChange,
    children,
    width,
}) => {
    const style = {}

    if (width) {
        style.minWidth = `${width}ch`
    }

    return (
        <div className={styles.selectWrapper}>
            <select
                disabled={disabled}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className={styles.select}
                style={style}
            >
                {children}
            </select>
        </div>
    )
}

export const ValueInput = ({ value, onChange, disabled }) => {
    const style = {
        width: `${Math.max(String(value).length, 5) + 5}ch`,
    }

    return (
        <Text
            unstyled
            className={styles.input}
            disabled={disabled}
            flushHistoryOnBlur
            onCommit={(value) => onChange(parseInt(value, 10))}
            style={style}
            type="number"
            value={value}
        />
    )
}

const MinuteAmountSelect = (props) => (
    <Select {...props}>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{String(minute)} min</option>
        ))}
    </Select>
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
    <Select {...props} width={weekdays[props.value].length + 1}>
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

const HourControl = ({ disabled, startDate, endDate, onChange }) => (
    <Fragment>
        From hour+ <MinuteAmountSelect
            value={startDate.minute}
            disabled={disabled}
            onChange={(value) => onChange({
                startDate: { minute: value },
            })}
        />
        <br />
        To hour+ <MinuteAmountSelect
            value={endDate.minute}
            disabled={disabled}
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
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            onChange={(value) => onChange({
                endDate: {
                    hour: endDate.hour,
                    minute: value,
                },
            })}
        />
    </Fragment>
)

const WeekControl = ({ disabled, startDate, endDate, onChange }) => (
    <Fragment>
        From <WeekdaySelect
            value={startDate.weekday}
            disabled={disabled}
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
            disabled={disabled}
            onChange={(value) => onChange({
                startDate: {
                    weekday: startDate.weekday,
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
            onChange={(value) => onChange({
                endDate: {
                    weekday: endDate.weekday,
                    hour: value,
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            disabled={disabled}
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

const MonthControl = ({ disabled, startDate, endDate, onChange }) => (
    <Fragment>
        From <DaySelect
            value={startDate.day}
            disabled={disabled}
            onChange={(value) => onChange({
                startDate: {
                    day: value,
                    hour: startDate.hour,
                    minute: startDate.minute,
                },
            })}
        />
        at <HourSelect
            value={startDate.hour}
            disabled={disabled}
            onChange={(value) => onChange({
                startDate: {
                    day: startDate.day,
                    hour: value,
                    minute: startDate.minute,
                },
            })}
        />:<MinuteSelect
            value={startDate.minute}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
            onChange={(value) => onChange({
                endDate: {
                    day: endDate.day,
                    hour: value,
                    minute: endDate.minute,
                },
            })}
        />:<MinuteSelect
            value={endDate.minute}
            disabled={disabled}
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

const YearControl = ({ disabled, startDate, endDate, onChange }) => (
    <Fragment>
        From <DaySelect
            value={startDate.day}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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

export class RuleComponent extends React.PureComponent {
    onRemove = () => {
        const { onRemove, rule } = this.props

        if (onRemove) {
            onRemove(rule.id)
        }
    }

    onIntervalChange = (intervalType) => {
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

    onValueChange = (value) => {
        this.props.onChange(this.props.rule.id, {
            value,
        })
    }

    render() {
        const { isHovered, rule, disabled } = this.props

        return (
            <div className={styles.ruleContainer}>
                {!!isHovered && (
                    <button
                        type="button"
                        onClick={this.onRemove}
                        className={styles.removeButton}
                        disabled={disabled}
                    >
                        <SvgIcon name="crossHeavy" className={styles.removeIcon} />
                    </button>
                )}
                Send value
                &nbsp;
                <ValueInput
                    value={rule.value}
                    onChange={this.onValueChange}
                    disabled={disabled}
                />
                <br />
                Every
                &nbsp;
                <Select value={rule.intervalType} onChange={this.onIntervalChange} disabled={disabled}>
                    {Object.keys(schedulerOptions).map((schedulerOption) => (
                        <option
                            key={schedulerOption}
                            value={schedulerOption}
                        >
                            {schedulerOptions[schedulerOption]}
                        </option>
                    ))}
                </Select>
                <br />
                {rule.intervalType === IntervalTypes.HOUR && (
                    <HourControl disabled={disabled} onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === IntervalTypes.DAY && (
                    <DayControl disabled={disabled} onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === IntervalTypes.WEEK && (
                    <WeekControl disabled={disabled} onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === IntervalTypes.MONTH && (
                    <MonthControl disabled={disabled} onChange={this.onUpdateDates} {...rule} />
                )}
                {rule.intervalType === IntervalTypes.YEAR && (
                    <YearControl disabled={disabled} onChange={this.onUpdateDates} {...rule} />
                )}
            </div>
        )
    }
}

const Rule = withHover(RuleComponent)

const defaultRule = {
    intervalType: IntervalTypes.HOUR,
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

export default class SchedulerModule extends React.PureComponent {
    state = {
        defaultValue: undefined,
        rules: undefined,
    }

    static getDerivedStateFromProps(props, state) {
        const checksum = JSON.stringify(props.module.schedule.rules)
        if (state.rules && state.checksum === checksum) {
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
            checksum,
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

    onDefaultValueChange = (defaultValue) => {
        this.setState({
            defaultValue,
        }, this.updateStateToModule)
    }

    updateStateToModule = () => {
        this.props.api.updateModule(this.props.moduleHash, {
            schedule: {
                ...this.state,
            },
        })
    }

    onSortEnd = ({ newIndex, oldIndex }) => {
        this.setState(({ rules }) => ({
            rules: arrayMove(rules, oldIndex, newIndex),
        }), this.updateStateToModule)
    }

    render() {
        const { isEditable } = this.props
        const { rules, defaultValue } = this.state

        return (
            <div className={styles.schedulerContainer}>
                <SortableList
                    disabled={!isEditable}
                    distance={1} /* This will allow clicks to pass through */
                    onSortEnd={this.onSortEnd}
                    lockAxis="y"
                    helperClass={styles.ruleContainerDragging}
                >
                    {rules.map((rule) => (
                        <Rule
                            key={rule.id}
                            onChange={this.onChangeRule}
                            onRemove={this.onRemoveRule}
                            disabled={!isEditable}
                            rule={rule}
                        />
                    ))}
                </SortableList>
                <div className={styles.footer}>
                    <div>
                        Default value:
                        &nbsp;
                        <ValueInput
                            value={defaultValue}
                            onChange={this.onDefaultValueChange}
                            disabled={!isEditable}
                        />
                    </div>
                    <div className={styles.addButtonContainer}>
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={this.onAddRule}
                            disabled={!isEditable}
                        >
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
