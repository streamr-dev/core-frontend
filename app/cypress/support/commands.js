Cypress.Commands.add('login', (email = 'tester1@streamr.com', password = 'tester1TESTER1') => {
    cy.visit('/login')
    cy.get('[type=email]').type(email)
    cy.get('button').click()
    if (password) {
        cy.get('[type=password]').type(password)
    }
    cy.get('button').click()
})

Cypress.Commands.add('logout', () => {
    cy.visit('/logout')
})
