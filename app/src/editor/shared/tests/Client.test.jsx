import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { useClient } from 'streamr-client-react'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import ClientProvider from '$shared/components/StreamrClientProvider'
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
            let client
            function Test() {
                client = useClient()
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
            expect(client).toBeTruthy()
            result.unmount()
            await client.disconnect()
            done()
        })

        it('holds the same client after disconnect', async (done) => {
            let client
            function Test() {
                client = useClient()
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
            expect(client).toBeTruthy()

            const prevClient = client
            await prevClient.connect()
            expect(prevClient.connection.getState()).toBe('connected')
            await act(async () => {
                // act required as we're triggering
                // context update outside a render/mount
                await prevClient.disconnect()
            })
            expect(prevClient.connection.getState()).toBe('disconnected')
            expect(client).toBe(prevClient)
            result.unmount()
            await prevClient.disconnect()
            await client.disconnect()
            done()
        })

        it('creates new client after unmount', async (done) => {
            let client
            function Test() {
                client = useClient()
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
            const prevClient = client
            expect(prevClient).toBeTruthy()
            result.unmount()
            result.mount()
            expect(client).not.toBe(prevClient)
            result.unmount()
            await prevClient.disconnect()
            await client.disconnect()
            done()
        })

        it('disconnects on unmount', async (done) => {
            let client
            function Test() {
                client = useClient()
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

            expect(client).toBeTruthy()
            client.once('disconnected', () => {
                expect(client.isConnected()).not.toBeTruthy()
                done()
            })

            await client.connect()
            result.unmount()
        })
    })

    it('can create client for unauthed user', async (done) => {
        let client
        function Test() {
            client = useClient()
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
        const prevClient = client
        expect(prevClient).toBeTruthy()

        result.unmount()
        result.mount()
        expect(client).not.toBe(prevClient)
        result.unmount()
        await prevClient.disconnect()
        await client.disconnect()
        done()
    })
})
