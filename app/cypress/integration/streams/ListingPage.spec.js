describe('Stream listing page', () => {
    it('requires a login', () => {
        cy.visit('/core/streams')
        cy.location('pathname').should('eq', '/login')
    })

    it('renders streams', () => {
        cy.login()
        cy.location('pathname').should('eq', '/core/streams')
        cy.contains(/public transport demo/i)
    })
})
