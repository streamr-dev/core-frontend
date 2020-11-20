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

    describe('activity status', () => {
        it('renders inactive color when no data is flowing', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.visit('/core/streams')
                cy.get(`[data-test-hook="Stream row for ${streamId}"]`).within(() => {
                    cy.get('[data-test-hook="Last message at"]').should('be.empty')
                    cy.get('[data-test-hook="Status inactive"]')
                })
            })
        })

        it('renders error color when fetching fails', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.server({
                    method: 'GET',
                    status: 404,
                    response: {},
                })
                cy.route(`/api/v1/streams/${streamId}/data/partitions/0/last?count=1`).as('getLastMessage')

                cy.visit('/core/streams')
                cy.wait('@getLastMessage')
                cy.get(`[data-test-hook="Stream row for ${streamId}"]`).within(() => {
                    cy.get('[data-test-hook="Last message at"]').should('be.empty')
                    cy.get('[data-test-hook="Status error"]')
                })
            })
        })

        it('renders active color when data is flowing', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.sendToStream(streamId, {
                    key: 'value',
                })

                // It looks like it takes a while for a message to get to the history storage.
                // That's why we're waiting 3s below.
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(3000)

                cy.visit('/core/streams')
                cy.get(`[data-test-hook="Stream row for ${streamId}"]`).within(() => {
                    cy.get('[data-test-hook="Last message at"]').contains('Just now')
                    cy.get('[data-test-hook="Status ok"]')
                })
            })
        })

        it('renders active color after a refresh and new data in the meantime', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                cy.visit('/core/streams')
                cy.get(`[data-test-hook="Stream row for ${streamId}"]`).within(() => {
                    cy.get('[data-test-hook="Last message at"]').should('be.empty')
                    cy.get('[data-test-hook="Status inactive"]')

                    cy.sendToStream(streamId, {
                        key: 'value',
                    })

                    // It looks like it takes a while for a message to get to the history storage.
                    // That's why we're waiting 3s below.
                    // eslint-disable-next-line cypress/no-unnecessary-waiting
                    cy.wait(3000)

                    cy.get('button').contains('Refresh').click({
                        force: true,
                    })

                    cy.get('[data-test-hook="Last message at"]').contains('Just now')
                    cy.get('[data-test-hook="Status ok"]')
                })
            })
        })
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

    it('takes the user to the new stream page', () => {
        cy.login()
        cy.visit('/core/streams/new')
        cy.location('pathname').should('eq', '/core/streams/new')
        cy.get('[data-test-hook=TOCPage]').find('h1').contains(/name your stream/i)

        // Wait for domains to load
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000)

        cy.get('[name=domain]').invoke('val').should('match', /^0x[0-9a-f.]+/i)
    })

    it('creates a stream and takes the user to the edit page', () => {
        cy.login()
        cy.visit('/core/streams/new')

        const path = uuid()
        cy.getDefaultEthAccount().then((domain) => {
            const streamId = `${domain}/test/${path}`
            cy.get('input[name=pathname]').clear().type(`test/${path}`)
            cy.get('input[name=description]').clear().type('Lorem ipsum.')
            cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()

            cy.location().should((l) => {
                const { params: { id } } = matchPath(l.pathname, {
                    path: '/core/streams/:id',
                })
                const encodedId = encodeURIComponent(streamId)
                expect(id).to.eq(encodedId)
                expect(l.pathname).to.eq(`/core/streams/${encodedId}`)
                expect(l.search).to.eq('?newStream=1')
            })

            // Wait for domains to load
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(3000)

            cy.get('[data-test-hook=TOCPage]').find('h1').contains(/set up your stream/i)
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('[name=pathname]').invoke('val').should('eq', `test/${path}`)
        })
    })

    it('does not save until valid path is given', () => {
        cy.login()
        cy.visit('/core/streams/new')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).should('exist')

        cy.get('input[name=pathname]').clear().type('invalid path name')

        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).should('exist')
        cy.contains(/path may only contain alpha-numeric characters/i).should('not.exist')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
        cy.contains(/path may only contain alpha-numeric characters/i).should('exist')

        cy.get('input[name=pathname]').clear().type('path/*($)name')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
        cy.contains(/path may only contain alpha-numeric characters/i).should('exist')

        cy.get('input[name=pathname]').clear().type('/path/')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
        cy.contains(/path name cannot start with a slash/i).should('exist')

        cy.get('input[name=pathname]').clear().type('path/')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
        cy.contains(/path name must end with an alpha-numeric character/i).should('exist')

        cy.get('input[name=pathname]').clear().type('path//name')
        cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
        cy.contains(/use a single slash to separate paths/i).should('exist')
    })

    it('gives an error if a stream with the same name exists', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.visit('/core/streams/new')
            cy.get('input[name=pathname]').clear().type(pathname)
            cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
            cy.contains(`Stream with id ${streamId} already exists`).should('exist')
        })
    })

    it('prompts to verify exit if there are unsaved changes', () => {
        cy.login()
        cy.visit('/core/streams/new')
        cy.get('input[name=pathname]').clear().type('mystream')

        // clicking back brings modal prompt
        cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
        cy.contains(/you have unsaved changes/i).should('exist')

        // dismiss with cancel
        cy.get('#modal-root').find('button').contains(/cancel/i).click()
        cy.location('pathname').should('eq', '/core/streams/new')

        // click back again to exit
        cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
        cy.get('#modal-root').find('button').contains(/ok/i).click()
        cy.location('pathname').should('eq', '/core/streams')
    })

    it('can create a path with dot separator in id', () => {
        // Althought the client-side routing handles dots quite well the backend infra does
        // not. Let's un-skip this spec once that is fixed.
        cy.login()
        cy.visit('/core/streams/new')
        const path = `${uuid()}/with.dot.separator`

        cy.getDefaultEthAccount().then((domain) => {
            const streamId = `${domain}/${path}`
            cy.get('input[name=pathname]').clear().type(path)
            cy.get('[data-test-hook=StreamId]').find('button').contains(/create/i).click()
            cy.location('pathname').should('eq', `/core/streams/${encodeURIComponent(streamId)}`)

            cy.visit('/core/streams')
            cy.visit(`/core/streams/${encodeURIComponent(streamId)}`)

            // Wait for domains to load
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(3000)

            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Set up your Stream')
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', path)
        })
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
            const encodedId = encodeURIComponent(streamId)

            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Set up your Stream')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${encodedId}`)
            cy.contains(/we don.t seem to be able to find/i)
            cy.location('pathname').should('eq', `/core/streams/${encodedId}`)
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
            const encodedId = encodeURIComponent(streamId)
            cy.route('GET', `/api/v1/streams/${streamId}`).as('getStream')
            cy.visit(`/core/streams/${encodedId}`)
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
            stream: {
                description: 'Lorem ipsum.',
                config: {
                    fields: [field1, field2],
                },
            },
        }).then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.createStreamPermission(streamId)
            cy.logout()
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')

            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', pathname)
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
            stream: {
                description: 'Lorem ipsum.',
                config: {
                    fields: [field1, field2],
                },
            },
        }).then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.createStreamPermission(streamId)
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', pathname)
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
            stream: {
                description: 'Lorem ipsum.',
                config: {
                    fields: [field1, field2],
                },
            },
        }).then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', pathname)
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
            stream: {
                config: {
                    fields: [],
                },
            },
        }).then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', pathname)
            cy.get('h3').contains('Fields').should('not.exist')
        })
    })

    it('skips displaying empty description', () => {
        cy.login()
        cy.createStream({
            stream: {
                description: '',
            },
        }).then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            const pathname = streamId.slice(streamId.indexOf('/') + 1)

            cy.createStreamPermission(streamId, null, 'stream_get')
            cy.logout()
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Read only stream')
            cy.get('[name=domain').invoke('val').should('match', /^0x[0-9a-f.]+/i)
            cy.get('input[name=pathname]').invoke('val').should('eq', pathname)
            cy.get('label').contains('Description').should('not.exist')
        })
    })

    describe('security levels', () => {
        it('displays "basic" level correctly', () => {
            cy.login()
            cy.createStream({
                stream: {
                    requireSignedData: false,
                    requireEncryptedData: false,
                },
            }).then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${encodedId}`)
                cy.contains(/no data security enforced/i)
            })
        })

        it('displays "signed" level correctly', () => {
            cy.login()
            cy.createStream({
                stream: {
                    requireSignedData: true,
                    requireEncryptedData: false,
                },
            }).then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${encodedId}`)
                cy.contains(/All data will be cryptographically signed/i)
            })
        })

        it('displays "encrypted" level correctly', () => {
            cy.login()
            cy.createStream({
                stream: {
                    requireSignedData: true,
                    requireEncryptedData: true,
                },
            }).then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${encodedId}`)
                cy.contains(/All data will be signed and end-to-end encrypted/i)
            })
        })
    })

    describe('<- back button', () => {
        it('takes logged in user with no edit permissions to their stream listing page', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
                cy.logout()
                cy.login('tester2@streamr.com', 'tester2')
                cy.visit(`/core/streams/${encodedId}`)
                cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
                cy.location('pathname').should('eq', '/core/streams')
            })
        })

        it('takes not logged in user to "/"', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId)
                cy.logout()
                cy.visit(`/core/streams/${encodedId}`)
                cy.get('[data-test-hook=Toolbar]').find('button').contains(/back/i).click()
                cy.location('pathname').should('eq', '/')
            })
        })
    })

    describe('Storage nodes UI', () => {
        it('displays disabled UI without checkboxes when unchecked', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
                cy.logout()
                cy.login('tester2@streamr.com', 'tester2')

                cy.server()

                cy.route('GET', `/api/v1/streams/${streamId}/storageNodes`).as('getNodes')

                cy.visit(`/core/streams/${encodedId}`)
                cy.wait('@getNodes')
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button:disabled').contains(/local/i).should('exist')
                    // Disabled and unchecked => no checkbox at all
                    cy.get('[data-test-hook="Checkbox on"]').should('not.exist')
                    cy.get('[data-test-hook="Checkbox off"]').should('not.exist')
                })
            })
        })

        it('displays disabled UI with checkboxes when checked', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.enableStorageNode(streamId, '0xde1112f631486CfC759A50196853011528bC5FA0')
                cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
                cy.logout()
                cy.login('tester2@streamr.com', 'tester2')

                cy.server()

                cy.route('GET', `/api/v1/streams/${streamId}/storageNodes`).as('getNodes')

                cy.visit(`/core/streams/${encodedId}`)
                cy.wait('@getNodes')
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button:disabled').contains(/local/i).should('exist')
                    // Disabled and checked => checked checkbox
                    cy.get('[data-test-hook="Checkbox on"]').should('exist')
                    cy.get('[data-test-hook="Checkbox off"]').should('not.exist')
                })
            })
        })
    })
})

describe('Stream edit page', () => {
    it('shows your streams as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Set up your Stream')
            cy.location('pathname').should('eq', `/core/streams/${encodedId}`)
        })
    })

    it('shows stream shared with you for editing as editable', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            // Having `edit` permission doesn't mean you can open the stream page w/o a 404. In
            // order to access it at all you need to be able to `get`. :/
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_get')
            cy.createStreamPermission(streamId, 'tester2@streamr.com', 'stream_edit')
            cy.logout()
            cy.login('tester2@streamr.com', 'tester2')
            cy.visit(`/core/streams/${encodedId}`)
            cy.get('[data-test-hook=TOCPage]').find('h1').contains('Set up your Stream')
            cy.location('pathname').should('eq', `/core/streams/${encodedId}`)
        })
    })

    it('allows you to save changes', () => {
        cy.login()
        cy.createStream().then((streamId) => {
            const encodedId = encodeURIComponent(streamId)
            cy.visit(`/core/streams/${encodedId}`)
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

    describe('activity status', () => {
        it('renders inactive color when no data is flowing', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.visit(`/core/streams/${encodedId}`)

                cy.get('[data-test-hook="TOCSection status"]').within(() => {
                    cy.get('[data-test-hook="Status inactive"]')
                })
            })
        })

        it('renders error color when fetching fails', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.server({
                    method: 'GET',
                    status: 404,
                    response: {},
                })
                cy.route(`/api/v1/streams/${streamId}/data/partitions/0/last?count=1`).as('getLastMessage')

                cy.visit(`/core/streams/${encodedId}`)
                cy.wait('@getLastMessage')

                cy.get('[data-test-hook="TOCSection status"]').within(() => {
                    cy.get('[data-test-hook="Status error"]')
                })
            })
        })

        it('renders active color when data is flowing', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.sendToStream(streamId, {
                    key: 'value',
                })

                // It looks like it takes a while for a message to get to the history storage.
                // That's why we're waiting 3s below.
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(3000)

                cy.visit(`/core/streams/${encodedId}`)

                cy.get('[data-test-hook="TOCSection status"]').within(() => {
                    cy.get('[data-test-hook="Status ok"]')
                })
            })
        })
    })

    describe('Storage nodes UI', () => {
        it('displays non-disabled UI', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.server()

                cy.route('GET', `/api/v1/streams/${streamId}/storageNodes`).as('getNodes')

                cy.visit(`/core/streams/${encodedId}`)
                cy.wait('@getNodes')
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button:not(:disabled)').contains(/local/i)
                    cy.get('[data-test-hook="Checkbox off"]').should('exist')
                })
            })
        })

        it('loads current nodes from the server', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.enableStorageNode(streamId, '0xde1112f631486CfC759A50196853011528bC5FA0')

                cy.server()

                cy.route('GET', `/api/v1/streams/${streamId}/storageNodes`).as('getNodes')

                cy.visit(`/core/streams/${encodedId}`)
                cy.wait('@getNodes')
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button [data-test-hook="Checkbox on"]').should('exist')
                })
            })
        })

        it('allows user to enable a storage node', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.server()

                cy.route('POST', `/api/v1/streams/${streamId}/storageNodes`).as('enableNode')

                cy.visit(`/core/streams/${encodedId}`)
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button [data-test-hook="Checkbox off"]').should('exist')
                    cy.get('button [data-test-hook="Checkbox on"]').should('not.exist')
                    cy.get('button').contains('Local').click()
                    cy.wait('@enableNode')
                    cy.get('button [data-test-hook="Checkbox on"]').should('exist')
                    cy.get('button [data-test-hook="Checkbox off"]').should('not.exist')
                })
            })
        })

        it('allows user to disable a storage node', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.enableStorageNode(streamId, '0xde1112f631486CfC759A50196853011528bC5FA0')

                cy.server()

                cy.route('DELETE', `/api/v1/streams/${streamId}/storageNodes/0xde1112f631486CfC759A50196853011528bC5FA0`).as('disableNode')

                cy.visit(`/core/streams/${encodedId}`)
                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button [data-test-hook="Checkbox on"]').should('exist')
                    cy.get('button [data-test-hook="Checkbox off"]').should('not.exist')
                    cy.get('button').contains('Local').click()
                    cy.wait('@disableNode')
                    cy.get('button [data-test-hook="Checkbox on"]').should('not.exist')
                    cy.get('button [data-test-hook="Checkbox off"]').should('exist')
                })
            })
        })

        it('does not toggle a storage node on network failure', () => {
            cy.login()
            cy.createStream().then((streamId) => {
                const encodedId = encodeURIComponent(streamId)
                cy.server()

                cy.route('GET', `/api/v1/streams/${streamId}`).as('getStream')

                cy.route({
                    method: 'POST',
                    status: 500,
                    response: [],
                    url: `/api/v1/streams/${streamId}/storageNodes`,
                }).as('enableNode')

                cy.visit(`/core/streams/${encodedId}`)

                cy.wait('@getStream')

                cy.get('[data-test-hook="Storage nodes"]').within(() => {
                    cy.get('button [data-test-hook="Checkbox off"]').should('exist')
                    cy.get('button').contains('Local').click()
                    cy.wait('@enableNode')
                    cy.get('button [data-test-hook="Checkbox off"]').should('exist')
                })
            })
        })
    })
})
