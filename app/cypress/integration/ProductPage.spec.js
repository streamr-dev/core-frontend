import qs from 'query-string'
import { matchPath } from 'react-router-dom'

describe('Product listing page', () => {
    it.skip('requires a login', () => {
        cy.visit('/core/products')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/products')
        })
    })

    it.skip('renders products', () => {
        cy.login()
        cy.visit('/core/products')
        cy.contains('Anonymous User')
        cy.location('pathname').should('eq', '/core/products')
    })
})

describe('New product', () => {
    it.skip('requires a user to be logged in', () => {
        cy.visit('/core/products/new')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/products/new')
        })
    })

    it.skip('creates a data product by default and takes the user to the edit page', () => {
        cy.login()
        cy.visit('/core/products/new')
        cy.location().should((l) => {
            const { params: { id } } = matchPath(l.pathname, {
                path: '/core/products/:id',
            })
            expect(l.pathname).to.eq(`/core/products/${id}/edit`)
            expect(l.search).to.eq('?newProduct=true')
        })
        cy.get('h1').contains(/Name your product/i)
        cy.get('h1').contains(/shared secret/).should('not.exist')
        cy.get('[name=name]').invoke('val').should('eq', 'Untitled Product')
    })

    it.skip('creates a data union and takes the user to the edit page', () => {
        cy.login()
        cy.visit('/core/products/new?type=DATAUNION')
        cy.location().should((l) => {
            const { params: { id } } = matchPath(l.pathname, {
                path: '/core/products/:id',
            })
            expect(l.pathname).to.eq(`/core/products/${id}/edit`)
            expect(l.search).to.eq('?newProduct=true')
        })
        cy.get('h1').contains(/Name your product/i)
        cy.get('h1').contains(/shared secret/)
        cy.get('[name=name]').invoke('val').should('eq', 'Untitled Product')
    })

    it.skip('shows the error page if product creation fails', () => {
        cy.ignoreUncaughtError(/failed with status code 422/i)

        cy.login()
        cy.server({
            method: 'POST',
            status: 422,
            response: {},
        })
        cy.route('http://localhost/api/v1/products').as('getProducts')
        cy.visit('/core/products/new')
        cy.wait('@getProducts')
        cy.contains(/something has broken/i)
    })

    it.skip('displays "not found" page if product is not published', () => {
        cy.ignoreUncaughtError(/could not be found/i)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/marketplace/products/${productId}`)
            cy.location('pathname').should('eq', `/marketplace/products/${productId}`)
            cy.contains(/we don.t seem to be able to find/i)
            cy.location('pathname').should('eq', `/marketplace/products/${productId}`)
        })
    })
})

describe('Edit product', () => {
    it.skip('displays "not found" page if user has no permission to edit', () => {
        cy.ignoreUncaughtError(/could not be found/i)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/core/products/${productId}/edit`)
            cy.location('pathname').should('eq', `/core/products/${productId}/edit`)
            cy.get('[name=name]').invoke('val').should('match', /test product #\d{4}\/\d{6}/i)
            cy.logout()
            cy.login('tester two')
            cy.visit(`/core/products/${productId}/edit`)
            cy.contains(/we don.t seem to be able to find/i)
            cy.location('pathname').should('eq', `/core/products/${productId}/edit`)
        })
    })
})

// TODO: Update test. /stats returns the "Whoops! We don't seem to be able to find your data." page also for existing products now
// describe('Data union stats', () => {
//     it.skip('displays "not found" page if product is not a data union', () => {
//         cy.ignoreUncaughtError(/could not be found/i)
//         cy.login()
//         cy.createProduct().then((productId) => {
//             cy.visit(`/core/products/${productId}/stats`)
//             cy.contains(/we don.t seem to be able to find/i)
//             cy.location('pathname').should('eq', `/core/products/${productId}/stats`)
//         })
//     })
// })

describe('Data union members', () => {
    it.skip('displays "not found" page if product is not a data union', () => {
        cy.ignoreUncaughtError(/could not be found/i)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/core/products/${productId}/members`)
            cy.contains(/we don.t seem to be able to find/i)
            cy.location('pathname').should('eq', `/core/products/${productId}/members`)
        })
    })
})
