import React, { useContext } from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { mount } from 'enzyme'

import { Context as RouterContext, Provider as RouterContextProvider } from '$shared/contexts/Router'

describe('RouterContext', () => {
    it('returns the route history', () => {
        let currentContext
        function Test() {
            currentContext = useContext(RouterContext)
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/first', '/second']}
            >
                <RouterContextProvider>
                    <Test />
                </RouterContextProvider>
            </MemoryRouter>
        ))

        expect(currentContext.history.length).toBe(2)
        expect(currentContext.location.pathname).toBe('/first')
    })

    it('returns the matched route', () => {
        let currentContext
        function Test() {
            currentContext = useContext(RouterContext)
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/home']}
            >
                <Route path="/home">
                    <RouterContextProvider>
                        <Test />
                    </RouterContextProvider>
                </Route>
            </MemoryRouter>
        ))

        expect(currentContext.match.path).toBe('/home')
        expect(currentContext.match.isExact).toBe(true)
    })

    it('returns the search query', () => {
        let currentContext
        function Test() {
            currentContext = useContext(RouterContext)
            return null
        }

        mount((
            <MemoryRouter
                initialEntries={['/products?filter=someFilter&order=desc']}
            >
                <RouterContextProvider>
                    <Test />
                </RouterContextProvider>
            </MemoryRouter>
        ))

        expect(currentContext.location.pathname).toBe('/products')
        expect(currentContext.location.search).toBe('?filter=someFilter&order=desc')
    })
})
