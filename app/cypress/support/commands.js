import StreamrClient from 'streamr-client'
import { setToken } from '$shared/utils/sessionToken'
import getAuthorizationHeader from '$shared/utils/getAuthorizationHeader'

Cypress.Commands.add('login', (username = 'tester1@streamr.com', password = 'tester1TESTER1') => (
    new StreamrClient({
        restUrl: 'http://localhost/api/v1',
        auth: {
            username,
            password,
        },
    }).session.getSessionToken().then(setToken)
))

Cypress.Commands.add('logout', () => {
    setToken(null)
})

Cypress.Commands.add('authenticatedRequest', (options = {}) => (
    cy.request({
        ...options,
        headers: {
            ...options.headers,
            ...getAuthorizationHeader(),
        },
    })
))

Cypress.Commands.add('createStream', (body) => (
    cy
        .authenticatedRequest({
            url: 'http://localhost/api/v1/streams',
            method: 'POST',
            body: {
                name: `Test Stream #${(
                    new Date()
                        .toISOString()
                        .replace(/\W/g, '')
                        .substr(4, 11)
                        .replace(/T/, '/')
                )}`,
                ...body,
            },
        })
        .then(({ body: { id } }) => id)
))

Cypress.Commands.add('getStream', (id) => {
    cy
        .authenticatedRequest({
            url: `http://localhost/api/v1/streams/${id}`,
        })
        .then(({ body }) => body)
})

Cypress.Commands.add('ignoreUncaughtError', (messageRegex) => {
    cy.on('uncaught:exception', (err) => {
        expect(err.message).to.match(messageRegex)
        return false
    })
})

Cypress.Commands.add('createStreamPermission', (streamId, user = null, operation = 'stream_get') => (
    cy
        .authenticatedRequest({
            url: `http://localhost/api/v1/streams/${streamId}/permissions`,
            method: 'POST',
            body: {
                anonymous: !user,
                new: true,
                operation,
                user,
            },
        })
))

Cypress.Commands.add('createProduct', (body) => (
    cy
        .authenticatedRequest({
            url: 'http://localhost/api/v1/products',
            method: 'POST',
            body: {
                name: `Test Product #${(
                    new Date()
                        .toISOString()
                        .replace(/\W/g, '')
                        .substr(4, 11)
                        .replace(/T/, '/')
                )}`,
                ...body,
            },
        })
        .then(({ body: { id } }) => id)
))
