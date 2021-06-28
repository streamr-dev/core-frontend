import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import useNewStreamMode from '$userpages/components/StreamPage/Edit/useNewStreamMode'

describe('useNewStreamMode', () => {
    it('returns false if newStream flag is not defined', () => {
        let result
        function Test() {
            result = useNewStreamMode()
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/streams/1234/edit']}
            >
                <Test />
            </MemoryRouter>
        ))

        expect(result).toBe(false)
    })

    it('returns true if newStream flag is defined', () => {
        let result
        function Test() {
            result = useNewStreamMode()
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/streams/1234/edit?newStream=true']}
            >
                <Test />
            </MemoryRouter>
        ))

        expect(result).toBe(true)
    })
})
