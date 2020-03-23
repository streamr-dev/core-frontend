import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import { Provider as RouterContextProvider } from '$shared/contexts/Router'
import useNewProductMode from '../useNewProductMode'

describe('RouterContext', () => {
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
                <RouterContextProvider>
                    <Test />
                </RouterContextProvider>
            </MemoryRouter>
        ))

        expect(result.isNewProduct).toBe(false)
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
                <RouterContextProvider>
                    <Test />
                </RouterContextProvider>
            </MemoryRouter>
        ))

        expect(result.isNewProduct).toBe(true)
    })
})
