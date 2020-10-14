import React from 'react'
import { mount } from 'enzyme'

import Checkbox from '$shared/components/Checkbox'

describe('Checkbox', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(<Checkbox value />)
    })

    it('renders the component', () => {
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('sets input value correctly', () => {
        expect(wrapper.find('input[type="checkbox"]').prop('checked')).toEqual(true)
    })
})
