import qs from 'query-string'
import { matchPath } from 'react-router-dom'
import uuid from 'uuid'

describe('Stream listing page', () => {
    it('requires a login', () => {
        cy.visit('/core/streams')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/streams')
        })
    })

    it('renders streams', () => {
        cy.login()
        cy.visit('/core/streams')
        cy.contains('Tester One')
        cy.location('pathname').should('eq', '/core/streams')
    })
})

describe('New stream page', () => {
    it('requires a user to be logged in', () => {
        cy.visit('/core/streams/new')
        cy.location().should((l) => {
            expect(l.pathname).to.eq('/login')
            expect(qs.parse(l.search).redirect).to.eq('/core/streams/new')
        })
    })

    it('creates a stream and takes the user to the edit page', () => {
        cy.login()
        cy.visit('/core/streams/new')
        cy.location().should((l) => {
            const { params: { id } } = matchPath(l.pathname, {
                path: '/core/streams/:id',
            })
            expect(l.pathname).to.eq(`/core/streams/${id}`)
            expect(l.search).to.eq('?newStream=1')
        })
        cy.get('[data-test-hook=TOCPage]').find('h1').contains(/set up your stream/i)
        cy.get('[name=name]').invoke('val').should('eq', 'Untitled Stream')
    })

    it('shows the error page if stream creation fails', () => {
        cy.ignoreUncaughtError(/failed with status code 422/i)

        cy.login()
        cy.server({
            method: 'POST',
            status: 422,
            response: {},
        })
        cy.route('/api/v1/streams').as('getStreams')
        cy.visit('/core/streams/new')
        cy.wait('@getStreams')
        cy.contains(/something has broken down here/i)
    })
})

describe('Stream read-only page (no edit permission)', () => {
    it('displays "not found" page if stream does not exist', () => {
        cy.ignoreUncaughtError(/could not be found/i)

        cy.visit('/core/streams/TEST')
        cy.contains(/we don.t seem to be able to find/i)
        cy.location('pathname').should('eq', '/core/streams/TEST')
    })

    it('displays "not found" page if user has no "read" permission', () => {
        cy.ignoreUncaughtError(/could not be found/i)

        cy.login()
        cy.createStream().then((streamId) => {
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Edit your Stream')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.contains(/we don.t seem to be able to find/i)
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
        })
    })

    it('displays the generic error page if getting stream fails', () => {
        cy.ignoreUncaughtError(/request failed with status code 501/i)

        cy.login()
        cy.createStream().then((streamId) => {
            cy.createStreamPermission(streamId)
            cy.logout()
            cy.server({
                method: 'GET',
                status: 501,
                response: {},
            })
            cy.route('GET', `/api/v1/streams/${streamId}`).as('getStream')
            cy.visit(`/core/streams/${streamId}`)
            cy.wait('@getStream')
            cy.contains(/something has broken down here/i)
        })
    })

    it('displays public stream information to not logged in users', () => {
        const field1 = {
            id: uuid(),
            name: 'foo',
            type: 'string',
        }

        const field2 = {
            id: uuid(),
            name: 'bar',
            type: 'number',
        }

        cy.login()
        cy.createStream({
            description: 'Lorem ipsum.',
            config: {
                fields: [field1, field2],
            },
        }).then((streamId) => {
            cy.createStreamPermission(streamId)
            cy.logout()
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('input[name=name]').invoke('val').should('match', /test stream #\d{4}\/\d{6}/i)
            cy.get('input[name=description]').invoke('val').should('eq', 'Lorem ipsum.')
            cy.get('h3').contains('Fields')
            cy.get(`input#name-${field1.id}`).invoke('val').should('eq', 'foo')
            cy.get(`input#type-${field1.id}`).invoke('val').should('eq', 'String')
            cy.get(`input#name-${field2.id}`).invoke('val').should('eq', 'bar')
            cy.get(`input#type-${field2.id}`).invoke('val').should('eq', 'Number')
        })
    })

    it('displays public stream information to logged in users w/o "get" permission', () => {
        const field1 = {
            id: uuid(),
            name: 'foo',
            type: 'string',
        }

        const field2 = {
            id: uuid(),
            name: 'bar',
            type: 'number',
        }

        cy.login()
        cy.createStream({
            description: 'Lorem ipsum.',
            config: {
                fields: [field1, field2],
            },
        }).then((streamId) => {
            cy.createStreamPermission(streamId)
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('input[name=name]').invoke('val').should('match', /test stream #\d{4}\/\d{6}/i)
            cy.get('input[name=description]').invoke('val').should('eq', 'Lorem ipsum.')
            cy.get('h3').contains('Fields')
            cy.get(`input#name-${field1.id}`).invoke('val').should('eq', 'foo')
            cy.get(`input#type-${field1.id}`).invoke('val').should('eq', 'String')
            cy.get(`input#name-${field2.id}`).invoke('val').should('eq', 'bar')
            cy.get(`input#type-${field2.id}`).invoke('val').should('eq', 'Number')
        })
    })

    it('displays stream information to users with "get" permission, no "edit"', () => {
        const field1 = {
            id: uuid(),
            name: 'foo',
            type: 'string',
        }

        const field2 = {
            id: uuid(),
            name: 'bar',
            type: 'number',
        }

        cy.login()
        cy.createStream({
            description: 'Lorem ipsum.',
            config: {
                fields: [field1, field2],
            },
        }).then((streamId) => {
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('input[name=name]').invoke('val').should('match', /test stream #\d{4}\/\d{6}/i)
            cy.get('input[name=description]').invoke('val').should('eq', 'Lorem ipsum.')
            cy.get('h3').contains('Fields')
            cy.get(`input#name-${field1.id}`).invoke('val').should('eq', 'foo')
            cy.get(`input#type-${field1.id}`).invoke('val').should('eq', 'String')
            cy.get(`input#name-${field2.id}`).invoke('val').should('eq', 'bar')
            cy.get(`input#type-${field2.id}`).invoke('val').should('eq', 'Number')
        })
    })

    it('skips displaying empty Fields section', () => {
        cy.login()
        cy.createStream({
            config: {
                fields: [],
            },
        }).then((streamId) => {
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('input[name=name]').invoke('val').should('match', /test stream #\d{4}\/\d{6}/i)
            cy.get('h3').contains('Fields').should('not.exist')
        })
    })

    it('skips displaying empty description', () => {
        cy.login()
        cy.createStream({
            description: '',
        }).then((streamId) => {
            cy.createStreamPermission(streamId, null, 'stream_get')
            cy.logout()
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('input[name=name]').invoke('val').should('match', /test stream #\d{4}\/\d{6}/i)
            cy.get('label').contains('Description').should('not.exist')
        })
    })

    describe('security levels', () => {
        it('displays "basic" level correctly', () => {
            cy.login()
            cy.createStream({
                requireSignedData: false,
                requireEncryptedData: false,
            }).then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${streamId}`)
                cy.contains(/no data security enforced/i)
            })
        })

        it('displays "signed" level correctly', () => {
            cy.login()
            cy.createStream({
                requireSignedData: true,
                requireEncryptedData: false,
            }).then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${streamId}`)
                cy.contains(/All data will be cryptographically signed/i)
            })
        })

        it('displays "encrypted" level correctly', () => {
            cy.login()
            cy.createStream({
                requireSignedData: true,
                requireEncryptedData: true,
            }).then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${streamId}`)
                cy.contains(/All data will be signed and end-to-end encrypted/i)
            })
        })
    })

    describe('<- back button', () => {
        it('takes logged in user with no edit permissions to their stream listing page', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
                cy.logout()
                cy.login('tester2@streamr.com', 'tester2')
                cy.visit(`/core/streams/${streamId}`)
                cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
                cy.location('pathname').should('eq', '/core/streams')
            })
        })

        it('takes not logged in user to "/"', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${streamId}`)
                cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
                cy.location('pathname').should('eq', '/')
            })
        })
    })

    describe('ranging', () => {
        it('renders a placeholder text if no data is available', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.server({
                    method: 'GET',
                    status: 200,
                    response: {
                        beginDate: null,
                        endDate: null,
                    },
                })
                cy.route(`http://localhost/api/v1/streams/${streamId}/range`).as('getRange')
                cy.visit(`/core/streams/${streamId}`)
                cy.wait('@getRange')
                cy.get('[name=range]').invoke('val').should('contain', 'No stored data.')
            })
        })

        it('renders a placeholder text if fetching the range fails', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.server({
                    method: 'GET',
                    status: 501,
                })
                cy.route(`http://localhost/api/v1/streams/${streamId}/range`).as('getRange')
                cy.visit(`/core/streams/${streamId}`)
                cy.wait('@getRange')
                cy.get('[name=range]').invoke('val').should('contain', 'No stored data.')
            })
        })

        it('fills the Stored data field with available range', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.createStreamPermission(streamId)
                cy.logout()

                const beginDate = new Date('2020-01-01T00:00')
                const endDate = new Date('2020-01-31T23:59')
                cy.server({
                    method: 'GET',
                    status: 200,
                    response: {
                        beginDate,
                        endDate,
                    },
                })
                cy.route(`http://localhost/api/v1/streams/${streamId}/range`).as('getRange')
                cy.visit(`/core/streams/${streamId}`)
                cy.wait('@getRange')
                cy.get('[name=range]')
                    .invoke('val')
                    .should('eq', `This stream has stored data between ${beginDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}.`)
            })
        })
    })
})

describe('Stream edit page', () => {
    it('shows your streams as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Edit your Stream')
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
        })
    })

    it('shows stream shared with you for editing as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            // Having `edit` permission doesn't mean you can open the stream page w/o a 404. In
            // order to access it at all you need to be able to `get`. :/
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_edit')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${streamId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Edit your Stream')
            cy.location('pathname').should('eq', `/core/streams/${streamId}`)
        })
    })

    it('allows you to save changes', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            cy.visit(`/core/streams/${streamId}`)
            cy.get('input[name=name]').clear().type('Lorem ipsum')
            cy.get('input[name=description]').type('Dolor sit emat.')
            cy.get('input[name=partitions]').clear().type('2')
            cy.get('[data-hook=level-2]').click()
            cy.get('button').contains('Add field').click()
            cy.get('input#newFieldName').type('foo')
            cy.get('#newFieldType').click()
            cy.get('#newFieldType').within(() => {
                cy.contains('String').click()
            })
            cy.get('button').contains('Add').click()
            cy.get('input[name=inactivityValue]').clear().type('3')
            cy.get('input[name=storageAmount]').clear().type('360')
            cy.get('button').contains('Save & Exit').click()
            cy.location('pathname').should('eq', '/core/streams')
            cy.contains('Stream saved successfully')
            cy.getStream(streamId).then((stream) => {
                expect(stream.name).to.eq('Lorem ipsum')
                expect(stream.description).to.eq('Dolor sit emat.')
                expect(stream.partitions).to.eq(2)
                expect(stream.config.fields).to.have.lengthOf(1)
                expect(stream.config.fields[0].name).to.eq('foo')
                expect(stream.config.fields[0].type).to.eq('string')
                expect(stream.inactivityThresholdHours).to.eq(72)
                expect(stream.storageDays).to.eq(360)
                expect(stream.requireEncryptedData).to.eq(true)
                expect(stream.requireSignedData).to.eq(true)
            })
        })
    })
})
