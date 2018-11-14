import React from 'react'
import { mount } from 'enzyme'

import Checkbox from '$auth/components/Checkbox'
import InputError from '$shared/components/FormControl/InputError'

describe(Checkbox.name, () => {
    it('does not render errors by default', () => {
        expect(mount(<Checkbox />).find(InputError).exists()).toBe(false)
    })

    it('renders given error', () => {
        expect(mount(<Checkbox error="message" />).find(InputError).text()).toBe('message')
    })

    it('renders error block if keepError flag is set', () => {
        expect(mount(<Checkbox keepError />).find(InputError).exists()).toBe(true)
    })
})
