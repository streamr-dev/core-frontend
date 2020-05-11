describe('Login page', () => {
    describe('logging in', () => {
        it('lets users log in', () => {
            cy.visit('/login')
            cy.get('[type=email]').type('tester1@streamr.com')
            cy.get('button').click()
            cy.get('[type=password]').type('tester1TESTER1')
            cy.get('button').click()
            cy.location('pathname').should('eq', '/core/streams')
            cy.visit('/logout')
            cy.location('pathname').should('eq', '/')
        })

        it('complains on invalid credentials', () => {
            cy.visit('/login')
            cy.get('[type=email]').type('tester1@streamr.com')
            cy.get('button').click()
            cy.get('[type=password]').type('invalid password')
            cy.get('button').click()
            cy.contains(/invalid username or password/i)
            cy.location('pathname').should('eq', '/login')
        })

        it('complains on invalid email address', () => {
            cy.visit('/login')
            cy.get('button').click()
            cy.contains(/email is required/i)
            cy.get('[type=email]').type('tester1')
            cy.get('button').click()
            cy.get('[type="email"]').then((i) => {
                // eslint-disable-next-line no-unused-expressions
                expect(i[0].validationMessage).to.not.be.empty
            })
            cy.location('pathname').should('eq', '/login')
        })

        it('complains on invalid password', () => {
            cy.visit('/login')
            cy.get('[type=email]').type('tester1@streamr.com')
            cy.get('button').click()
            cy.get('button').click()
            cy.contains(/password is required/i)
            cy.location('pathname').should('eq', '/login')
        })
    })

    describe('Navigation / logo', () => {
        it('takes user to root location', () => {
            cy.visit('/login')
            cy.get('a[data-logo]').click()
            cy.location('pathname').should('eq', '/')
        })
    })

    describe('Navigation / sign up link', () => {
        it('takes user to the sign up page', () => {
            cy.visit('/login')
            cy.contains(/sign up/i).click()
            cy.location('pathname').should('eq', '/signup')
        })
    })

    describe('Navigation / forgot password link', () => {
        it('takes user to the forgot password page', () => {
            cy.visit('/login')
            cy.get('[type=email]').type('tester1@streamr.com')
            cy.get('button').click()
            cy.contains(/forgot your password/i).click()
            cy.location('pathname').should('eq', '/forgotPassword')
        })
    })

    describe('Authenticate with ethereum', () => {
        it('is accessible from the regular login page via the link in the navigation', () => {
            cy.visit('/login')
            cy.contains(/with ethereum/i).click()
            cy.get('[data-title]').contains(/authenticate with ethereum/i)
            cy.contains(/back/i).click()
            cy.get('[data-title]').contains(/sign in/i)
        })

        it('detects if web3 is accessible', () => {
            cy.visit('/login')
            cy.contains(/with ethereum/i).click()
            cy.contains(/web3 not supported/i)
        })
    })
})
