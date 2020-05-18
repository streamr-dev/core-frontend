/* eslint-disable no-unused-expressions */

import qs from 'query-string'
import { matchPath } from 'react-router-dom'

describe('New stream page', () => {
    it('requires a user to be logged in', () => {
        cy.visit('/core/streams/new')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/streams/new')
        })
    })

    it('creates a stream and takes the user to the edit page', () => {
        cy.login()
        cy.visit('/core/streams/new')
        cy.location().should((l) => {
            const { params: { id } } = matchPath(l.pathname, {
                path: '/core/streams/:id',
            })
            expect(l.pathname).to.eq(`/core/streams/${id}`)
            expect(l.search).to.eq('?newStream=1')
        })
        cy.get('h1').contains(/set up your stream/i)
        cy.get('[name=name]').invoke('val').should('eq', 'Untitled Stream')
    })

    it('shows the error page if stream creation fails', (done) => {
        cy.ignoreUncaughtError(/failed with status code 422/i, done)

        cy.login()
        cy.server({
            method: 'POST',
            status: 422,
            response: {},
        })
        cy.route('http://localhost/api/v1/streams')
        cy.visit('/core/streams/new')
        cy.contains('[alt="App crashed"]')
    })
})
