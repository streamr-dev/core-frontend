describe('Stream listing page', () => {
    it('requires a login', () => {
        cy.visit('/core/streams')
        cy.location('pathname').should('eq', '/login')
    })

    it('renders streams', () => {
        cy.login()
        cy.visit('/core/streams')
        cy.location('pathname').should('eq', '/core/streams')
    })
})
