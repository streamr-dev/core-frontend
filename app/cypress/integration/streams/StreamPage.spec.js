describe('Stream page', () => {
    it('shows the 404 page for non-existing stream', (done) => {
        cy.ignoreUncaught404(done)

        cy.visit('/core/streams/TEST')
        cy.location('pathname').should('eq', '/core/streams/TEST')
        cy.contains('[alt="Not found"]')
    })

    it('shows the 404 page for streams you do not have permissions for', (done) => {
        cy.ignoreUncaught404(done)

        cy.login()
        cy.createStream().then((streamId) => {
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
            cy.contains('[alt="Not found"]')
        })
    })

    it('shows your streams as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            cy.visit(`/core/streams/${streamId}`)
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
            cy.get('h1').contains('Edit your Stream')
        })
    })

    it('shows stream shared with you for viewing as read-only', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'read')
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
            cy.get('h1').contains(/test stream #\d{4}\/\d{6}/i)
        })
    })

    it('shows stream shared with you for editing as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            // Having `write` permission doesn't mean you can open the stream page w/o a 404. In
            // order to access it at all you need to be able to `read`. :/
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'read')
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'write')
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
            cy.get('h1').contains('Edit your Stream')
        })
    })
})
