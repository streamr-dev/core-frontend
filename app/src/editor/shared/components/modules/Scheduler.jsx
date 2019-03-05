import React from 'react'
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

class Rule extends React.Component {
    onRemove = () => {
        const { onRemove, rule } = this.props

        if (onRemove) {
            onRemove(rule.id)
        }
    }

    renderHourControls = () => (
        <div>hour</div>
    )

    renderDayControls = () => (
        <div>day</div>
    )

    renderWeekControls = () => (
        <div>week</div>
    )

    renderMonthControls = () => (
        <div>month</div>
    )

    renderYearControls = () => (
        <div>year</div>
    )

    renderIntervalControls = () => {
        const { intervalType } = this.props.rule

        switch (intervalType) {
            case 0:
                return this.renderHourControls()

            case 1:
                return this.renderDayControls()

            case 2:
                return this.renderWeekControls()

            case 3:
                return this.renderMonthControls()

            case 4:
                return this.renderYearControls()

            default:
                return null
        }
    }

    onIntervalChange = (e) => {
        this.props.onChange(this.props.rule.id, {
            intervalType: parseInt(e.target.value, 10),
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
                        <option value={value}>{schedulerOptions[value]}</option>
                    ))}
                </select>
                {this.renderIntervalControls()}
            </div>
        )
    }
}

const RuleRow = withHover(Rule)

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
        }))
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
                        <RuleRow
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
