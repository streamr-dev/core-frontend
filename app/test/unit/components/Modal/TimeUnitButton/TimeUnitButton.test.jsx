import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { TimeUnitButton } from '../../../../../src/marketplace/components/Modal/SetPriceDialog/TimeUnitButton'

describe('TimeUnitButton', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('render', () => {
        it('selected TimeUnitButton has an active class', () => {
            const wrapper = shallow(<TimeUnitButton
                value="hour"
                className=""
                active
                translate={() => {}}
            />)

            expect(wrapper.find('div').hasClass('active')).toEqual(true)
        })
    })
})
