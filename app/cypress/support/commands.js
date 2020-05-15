// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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
