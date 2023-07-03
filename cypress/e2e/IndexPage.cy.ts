describe('Index page', () => {
    it('redirects from / to /hub/projects', () => {
        cy.visit('/')
        cy.location('pathname').should('eq', '/hub/projects')
    })
})
