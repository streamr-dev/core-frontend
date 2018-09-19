import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { TimeUnitSelector } from '../../../../../src/components/Modal/SetPriceDialog/TimeUnitSelector'

describe('TimeUnitSelector', () => {
    let sandbox
    const onChange = sinon.spy()

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('time duration selector', () => {
        it('time duration selector contains 4 options', () => {
            const wrapper = shallow(<TimeUnitSelector selected="month" onChange={onChange} />)
            expect(wrapper.find('.timeUnit').length).toEqual(4)
        })

        it('exactly one correct selected TimeUnitButton component holds an active property', () => {
            const wrapper = shallow(<TimeUnitSelector selected="month" onChange={onChange} />)
            expect(wrapper.find('[value="hour"]').props().active).toEqual(false)
            expect(wrapper.find('[value="day"]').props().active).toEqual(false)
            expect(wrapper.find('[value="week"]').props().active).toEqual(false)
            expect(wrapper.find('[value="month"]').props().active).toEqual(true)
        })
    })
})
