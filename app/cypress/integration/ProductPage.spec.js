import qs from 'query-string'
import { matchPath } from 'react-router-dom'

describe('Product listing page', () => {
    it('requires a login', () => {
        cy.visit('/core/products')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/products')
        })
    })

    it('renders products', () => {
        cy.login()
        cy.visit('/core/products')
        cy.contains('Tester One')
        cy.location('pathname').should('eq', '/core/products')
    })
})

describe('New product', () => {
    it('requires a user to be logged in', () => {
        cy.visit('/core/products/new')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/products/new')
        })
    })

    it('creates a data product by default and takes the user to the edit page', () => {
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

    it('creates a data union and takes the user to the edit page', () => {
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

    it('shows the error page if product creation fails', (done) => {
        cy.ignoreUncaughtError(/failed with status code 422/i, done)

        cy.login()
        cy.server({
            method: 'POST',
            status: 422,
            response: {},
        })
        cy.route('http://localhost/api/v1/products')
        cy.visit('/core/products/new')
        cy.contains('[alt="App crashed"]')
    })

    it('displays "not found" page if product is not published', (done) => {
        cy.ignoreUncaughtError(/could not be found/i, done)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/marketplace/products/${productId}`)
            cy.location('pathname').should('eq', `/marketplace/products/${productId}`)
            cy.contains('[alt="Not found"]')
            cy.location('pathname').should('eq', `/core/products/${productId}/edit`)
        })
    })
})

describe('Edit product', () => {
    it('displays "not found" page if user has no permission to edit', (done) => {
        cy.ignoreUncaughtError(/could not be found/i, done)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/core/products/${productId}/edit`)
            cy.location('pathname').should('eq', `/core/products/${productId}/edit`)
            cy.get('[name=name]').invoke('val').should('match', /test product #\d{4}\/\d{6}/i)
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/products/${productId}/edit`)
            cy.contains('[alt="Not found"]')
            cy.location('pathname').should('eq', `/core/products/${productId}/edit`)
        })
    })
})

describe('Data union stats', () => {
    it('displays "not found" page if product is not a data union', (done) => {
        cy.ignoreUncaughtError(/could not be found/i, done)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/core/products/${productId}/stats`)
            cy.contains('[alt="Not found"]')
            cy.location('pathname').should('eq', `/core/products/${productId}/stats`)
        })
    })
})

describe('Data union members', () => {
    it('displays "not found" page if product is not a data union', (done) => {
        cy.ignoreUncaughtError(/could not be found/i, done)

        cy.login()
        cy.createProduct().then((productId) => {
            cy.visit(`/core/products/${productId}/members`)
            cy.contains('[alt="Not found"]')
            cy.location('pathname').should('eq', `/core/products/${productId}/members`)
        })
    })
})
