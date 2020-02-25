import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import SchedulerModule, { RuleComponent } from '$editor/shared/components/modules/Scheduler'
import SortableList from '$shared/components/SortableList'

describe('Scheduler', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('SchedulerModule', () => {
        const module = {
            schedule: {
                rules: [],
                defaultValue: 0,
            },
        }

        it('should render a default value input', () => {
            const el = shallow(<SchedulerModule module={module} />)
            assert(el.find('ValueInput').exists())
        })

        it('should render an add button', () => {
            const el = shallow(<SchedulerModule module={module} />)
            assert(el.find('button').exists())
        })

        it('should render a sortable list of rules', () => {
            const nextModule = {
                ...module,
                schedule: {
                    ...module.schedule,
                    rules: [{
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }, {
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }],
                },
            }
            const el = shallow(<SchedulerModule module={nextModule} />)
            const sortableList = el.find(SortableList)

            assert(sortableList.exists())
            assert(sortableList.children().length === 2)
        })

        it('should add one rule by default', () => {
            const el = shallow(<SchedulerModule module={module} />)

            assert(el.state('rules').length === 1)
        })

        it('should update the default value', () => {
            const updateSpy = sandbox.spy()
            const moduleHash = 'test'
            const el = shallow(<SchedulerModule
                module={module}
                moduleHash={moduleHash}
                api={{
                    updateModule: updateSpy,
                }}
            />)
            assert(el.state('defaultValue') === 0)

            el.instance().onDefaultValueChange(20)
            assert(el.state('defaultValue') === 20)
            assert(updateSpy.calledOnce)
            assert(updateSpy.calledWith(moduleHash, {
                schedule: {
                    ...el.state(),
                },
            }))
        })

        it('should update a rule value', () => {
            const updateSpy = sandbox.spy()
            const moduleHash = 'test'
            const nextModule = {
                ...module,
                schedule: {
                    ...module.schedule,
                    rules: [{
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }, {
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }],
                },
            }
            const el = shallow(<SchedulerModule
                module={nextModule}
                moduleHash={moduleHash}
                api={{
                    updateModule: updateSpy,
                }}
            />)
            const rulesWithIds = el.state('rules')

            el.instance().onChangeRule(rulesWithIds[0].id, { value: 20 })
            assert(updateSpy.calledOnce)
            assert(updateSpy.calledWith(moduleHash))
        })

        it('should add a rule', () => {
            const updateSpy = sandbox.spy()
            const moduleHash = 'test'
            const nextModule = {
                ...module,
                schedule: {
                    ...module.schedule,
                    rules: [{
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }, {
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }],
                },
            }
            const el = shallow(<SchedulerModule
                module={nextModule}
                moduleHash={moduleHash}
                api={{
                    updateModule: updateSpy,
                }}
            />)
            assert(el.state('rules').length === 2)

            el.instance().onAddRule()
            assert(el.state('rules').length === 3)
            assert(updateSpy.calledOnce)
            assert(updateSpy.calledWith(moduleHash))
        })

        it('should remove a rule', () => {
            const updateSpy = sandbox.spy()
            const moduleHash = 'test'
            const nextModule = {
                ...module,
                schedule: {
                    ...module.schedule,
                    rules: [{
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }, {
                        intervalType: 0,
                        startDate: { minute: 0 },
                        endDate: { minute: 0 },
                        value: 0,
                    }],
                },
            }
            const el = shallow(<SchedulerModule
                module={nextModule}
                moduleHash={moduleHash}
                api={{
                    updateModule: updateSpy,
                }}
            />)
            const rulesWithIds = el.state('rules')
            assert(el.state('rules').length === 2)

            el.instance().onRemoveRule(rulesWithIds[0].id)
            assert(el.state('rules').length === 1)
            assert(updateSpy.calledOnce)
            assert(updateSpy.calledWith(moduleHash))
        })
    })

    describe('Rule', () => {
        const hourRule = {
            startDate: { minute: 0 },
            endDate: { minute: 0 },
            intervalType: 0,
            value: 0,
        }
        const dayRule = {
            startDate: {
                hour: 0,
                minute: 0,
            },
            endDate: {
                hour: 0,
                minute: 0,
            },
            intervalType: 1,
            value: 0,
        }
        const weekRule = {
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
            intervalType: 2,
            value: 0,
        }
        const monthRule = {
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
            intervalType: 3,
            value: 0,
        }
        const yearRule = {
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
            intervalType: 4,
            value: 0,
        }

        it('should render a value input and interval selector', () => {
            const el = shallow(<RuleComponent rule={hourRule} />)
            assert(el.find('ValueInput').exists())
            assert(el.find('Select').exists())
            assert(el.find('Select').children().length === 5)
        })

        it('should render HourControl', () => {
            const el = shallow(<RuleComponent rule={hourRule} />)
            assert(el.find('HourControl').exists())
        })

        it('should render DayControl', () => {
            const el = shallow(<RuleComponent rule={dayRule} />)
            assert(el.find('DayControl').exists())
        })

        it('should render WeekControl', () => {
            const el = shallow(<RuleComponent rule={weekRule} />)
            assert(el.find('WeekControl').exists())
        })

        it('should render MonthControl', () => {
            const el = shallow(<RuleComponent rule={monthRule} />)
            assert(el.find('MonthControl').exists())
        })

        it('should render YearControl', () => {
            const el = shallow(<RuleComponent rule={yearRule} />)
            assert(el.find('YearControl').exists())
        })

        it('should show remove button when hovering', () => {
            const el = shallow(<RuleComponent rule={yearRule} />)
            assert(el.find('button').exists() === false)
            el.setProps({ isHovered: true })
            assert(el.find('button').exists())
        })

        it('should set default date when interval changes', () => {
            const nextRule = {
                ...hourRule,
                startDate: {
                    minute: 20,
                },
                endDate: {
                    minute: 30,
                },
                id: 'test',
            }
            const onChangeSpy = sandbox.spy()
            const el = shallow(<RuleComponent
                rule={nextRule}
                onChange={onChangeSpy}
            />)

            assert.deepEqual(el.instance().props.rule, nextRule)

            el.instance().onIntervalChange(2)
            assert(onChangeSpy.calledOnce)
            assert(onChangeSpy.calledWith(nextRule.id, {
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
                intervalType: 2,
            }))
        })

        it('calls onRemove', () => {
            const nextRule = {
                ...hourRule,
                id: 'test',
            }
            const onRemoveSpy = sandbox.spy()
            const el = shallow(<RuleComponent
                rule={nextRule}
                onRemove={onRemoveSpy}
            />)
            el.instance().onRemove(nextRule.id)

            assert(onRemoveSpy.calledOnce)
            assert(onRemoveSpy.calledWith(nextRule.id))
        })

        it('updates the value', () => {
            const nextRule = {
                ...hourRule,
                id: 'test',
            }
            const newValue = 20
            const onChangeSpy = sandbox.spy()
            const el = shallow(<RuleComponent
                rule={nextRule}
                onChange={onChangeSpy}
            />)
            el.instance().onValueChange(newValue)

            assert(onChangeSpy.calledOnce)
            assert(onChangeSpy.calledWith(nextRule.id, {
                value: newValue,
            }))
        })

        it('updates the dates', () => {
            const nextRule = {
                ...hourRule,
                id: 'test',
            }
            const onChangeSpy = sandbox.spy()
            const el = shallow(<RuleComponent
                rule={nextRule}
                onChange={onChangeSpy}
            />)
            el.instance().onUpdateDates({
                startDate: { minute: 20 },
            })

            assert(onChangeSpy.calledOnce)
            assert(onChangeSpy.calledWith(nextRule.id, {
                startDate: { minute: 20 },
            }))
        })
    })
})
