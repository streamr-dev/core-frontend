import React from 'react'
import { shallow } from 'enzyme'
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
            expect(el.find('ValueInput').exists()).toBe(true)
        })

        it('should render an add button', () => {
            const el = shallow(<SchedulerModule module={module} />)
            expect(el.find('button').exists()).toBe(true)
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

            expect(sortableList.exists()).toBe(true)
            expect(sortableList.children().length).toBe(2)
        })

        it('should add one rule by default', () => {
            const el = shallow(<SchedulerModule module={module} />)

            expect(el.state('rules').length).toBe(1)
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
            expect(el.state('defaultValue')).toBe(0)

            el.instance().onDefaultValueChange(20)
            expect(el.state('defaultValue')).toBe(20)
            expect(updateSpy.calledOnce).toBe(true)
            expect(updateSpy.calledWith(moduleHash, {
                schedule: {
                    ...el.state(),
                },
            })).toBe(true)
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
            expect(updateSpy.calledOnce).toBe(true)
            expect(updateSpy.calledWith(moduleHash)).toBe(true)
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
            expect(el.state('rules').length).toBe(2)

            el.instance().onAddRule()
            expect(el.state('rules').length).toBe(3)
            expect(updateSpy.calledOnce).toBe(true)
            expect(updateSpy.calledWith(moduleHash)).toBe(true)
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
            expect(el.state('rules').length).toBe(2)

            el.instance().onRemoveRule(rulesWithIds[0].id)
            expect(el.state('rules').length).toBe(1)
            expect(updateSpy.calledOnce).toBe(true)
            expect(updateSpy.calledWith(moduleHash)).toBe(true)
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
            expect(el.find('ValueInput').exists()).toBe(true)
            expect(el.find('Select').exists()).toBe(true)
            expect(el.find('Select').children().length).toBe(5)
        })

        it('should render HourControl', () => {
            const el = shallow(<RuleComponent rule={hourRule} />)
            expect(el.find('HourControl').exists()).toBe(true)
        })

        it('should render DayControl', () => {
            const el = shallow(<RuleComponent rule={dayRule} />)
            expect(el.find('DayControl').exists()).toBe(true)
        })

        it('should render WeekControl', () => {
            const el = shallow(<RuleComponent rule={weekRule} />)
            expect(el.find('WeekControl').exists()).toBe(true)
        })

        it('should render MonthControl', () => {
            const el = shallow(<RuleComponent rule={monthRule} />)
            expect(el.find('MonthControl').exists()).toBe(true)
        })

        it('should render YearControl', () => {
            const el = shallow(<RuleComponent rule={yearRule} />)
            expect(el.find('YearControl').exists()).toBe(true)
        })

        it('should show remove button when hovering', () => {
            const el = shallow(<RuleComponent rule={yearRule} />)
            expect(el.find('button').exists()).toBe(false)
            el.setProps({ isHovered: true })
            expect(el.find('button').exists()).toBe(true)
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

            expect(el.instance().props.rule).toStrictEqual(nextRule)

            el.instance().onIntervalChange(2)
            expect(onChangeSpy.calledOnce).toBe(true)
            expect(onChangeSpy.calledWith(nextRule.id, {
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
            })).toBe(true)
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

            expect(onRemoveSpy.calledOnce).toBe(true)
            expect(onRemoveSpy.calledWith(nextRule.id)).toBe(true)
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

            expect(onChangeSpy.calledOnce).toBe(true)
            expect(onChangeSpy.calledWith(nextRule.id, {
                value: newValue,
            })).toBe(true)
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

            expect(onChangeSpy.calledOnce).toBe(true)
            expect(onChangeSpy.calledWith(nextRule.id, {
                startDate: { minute: 20 },
            })).toBe(true)
        })
    })
})
