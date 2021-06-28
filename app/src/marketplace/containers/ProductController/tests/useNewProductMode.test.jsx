import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import useNewProductMode from '../useNewProductMode'

describe('useNewProductMode', () => {
    it('returns false if newProduct flag is not defined', () => {
        let result
        function Test() {
            result = useNewProductMode()
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/products/1234/edit']}
            >
                <Test />
            </MemoryRouter>
        ))

        expect(result).toBe(false)
    })

    it('returns true if newProduct flag is defined', () => {
        let result
        function Test() {
            result = useNewProductMode()
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/products/1234/edit?newProduct=true']}
            >
                <Test />
            </MemoryRouter>
        ))

        expect(result).toBe(true)
    })
})
