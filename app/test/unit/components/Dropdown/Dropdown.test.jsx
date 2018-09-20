import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Dropdown from '../../../../src/marketplace/components/Dropdown'

describe('Dropdown', () => {
    let wrapper
    const options = {
        a: 'a',
        b: 'b',
    }
    const onSelect = sinon.spy()

    beforeEach(() => {
        wrapper = shallow(<Dropdown options={options} onSelect={onSelect} />)
    })

    it('renders the component', () => {
        expect(wrapper.length).toEqual(1)
    })

    it('renders the options', () => {
        expect(wrapper.find('option').length).toEqual(2)
    })

    it('calls onSelect on option change', () => {
        wrapper.simulate('change', {
            target: {
                value: 'b',
            },
        })
        expect(onSelect.calledOnce).toEqual(true)
        expect(onSelect.calledWith('b')).toEqual(true)
    })
})
