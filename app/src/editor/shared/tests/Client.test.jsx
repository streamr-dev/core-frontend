import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Provider as ClientProvider, Context as ClientContext } from '$shared/contexts/StreamrClient'
import mockStore from '$testUtils/mockStoreProvider'

describe('Client', () => {
    describe('when user is authenticated', () => {
        let teardown

        beforeAll(async () => {
            teardown = await setupAuthorizationHeader()
        }, 60000)

        afterAll(async () => {
            await teardown()
        })

        it('creates client on mount, can unmount', async (done) => {
            let currentContext
            function Test() {
                currentContext = useContext(ClientContext)
                return null
            }

            const store = {
                user: {},
            }

            const result = mount((
                <Provider store={mockStore(store)}>
                    <ClientProvider>
                        <Test />
                    </ClientProvider>
                </Provider>
            ))
            expect(currentContext.client).toBeTruthy()
            const { client } = currentContext
            result.unmount()
            await client.ensureDisconnected()
            done()
        })

        it('creates new client after disconnect', async (done) => {
            let currentContext
            function Test() {
                currentContext = useContext(ClientContext)
                return null
            }

            const store = {
                user: {},
            }

            const result = mount((
                <Provider store={mockStore(store)}>
                    <ClientProvider>
                        <Test />
                    </ClientProvider>
                </Provider>
            ))
            const { client } = currentContext
            expect(client).toBeTruthy()

            const prevClient = client
            await prevClient.ensureConnected()
            expect(prevClient.connection.state).toBe('connected')
            await act(async () => {
                // act required as we're triggering
                // context update outside a render/mount
                await prevClient.ensureDisconnected()
            })
            expect(prevClient.connection.state).toBe('disconnected')
            expect(currentContext.client).not.toBe(prevClient)
            result.unmount()
            await prevClient.ensureDisconnected()
            await currentContext.client.ensureDisconnected()
            done()
        })

        it('creates new client after unmount', async (done) => {
            let currentContext
            function Test() {
                currentContext = useContext(ClientContext)
                return null
            }

            const store = {
                user: {},
            }

            const result = mount((
                <Provider store={mockStore(store)}>
                    <ClientProvider>
                        <Test />
                    </ClientProvider>
                </Provider>
            ))
            const { client: prevClient } = currentContext
            expect(prevClient).toBeTruthy()
            result.unmount()
            result.mount()
            expect(currentContext.client).not.toBe(prevClient)
            result.unmount()
            await prevClient.ensureDisconnected()
            await currentContext.client.ensureDisconnected()
            done()
        })

        it('disconnects on unmount', async (done) => {
            let currentContext
            function Test() {
                currentContext = useContext(ClientContext)
                return null
            }

            const store = {
                user: {},
            }

            const result = mount((
                <Provider store={mockStore(store)}>
                    <ClientProvider>
                        <Test />
                    </ClientProvider>
                </Provider>
            ))

            expect(currentContext.client).toBeTruthy()
            const { client } = currentContext

            client.once('disconnected', () => {
                expect(client.isConnected()).not.toBeTruthy()
                done()
            })

            await client.ensureConnected()
            result.unmount()
        })
    })

    it('can create client for unauthed user', async (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const store = {
            user: {},
            userDataError: new Error('Anything'),
        }

        const result = mount((
            <Provider store={mockStore(store)}>
                <ClientProvider>
                    <Test />
                </ClientProvider>
            </Provider>
        ))
        const { client: prevClient } = currentContext
        expect(prevClient).toBeTruthy()

        result.unmount()
        result.mount()
        expect(currentContext.client).not.toBe(prevClient)
        result.unmount()
        await prevClient.ensureDisconnected()
        await currentContext.client.ensureDisconnected()
        done()
    })
})
