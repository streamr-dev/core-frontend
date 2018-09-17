import React from 'react'
import { shallow } from 'enzyme'

import CheckBox from '../../../../src/components/Checkbox'

describe('Checkbox', () => {
    let wrapper
    const value = true
    const className = 'extra'
    const otherProps = {
        a: 'a',
        b: 'b',
    }

    beforeEach(() => {
        wrapper = shallow(<CheckBox value={value} className={className} {...otherProps} />)
    })

    it('renders the component', () => {
        expect(wrapper.length).toEqual(1)
    })

    it('sets input value correctly', () => {
        expect(wrapper.find('input[type="checkbox"]').prop('checked')).toEqual(value)
    })

    it('adds extra classname', () => {
        expect(wrapper.find('input[type="checkbox"]').prop('className')).toEqual(`root ${className}`)
    })

    it('adds extra props', () => {
        expect(wrapper.find('input[type="checkbox"]').prop('a')).toEqual(otherProps.a)
        expect(wrapper.find('input[type="checkbox"]').prop('b')).toEqual(otherProps.b)
    })
})
