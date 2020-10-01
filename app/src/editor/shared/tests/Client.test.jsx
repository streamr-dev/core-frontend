import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import { act } from 'react-dom/test-utils'
import { ClientProviderComponent, Context as ClientContext } from '$shared/contexts/StreamrClient'

describe('Client', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    it('creates client on mount, can unmount', (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent>
                <Test />
            </ClientProviderComponent>
        ))

        expect(currentContext.client).toBeTruthy()
        const { client } = currentContext
        client.once('error', done)

        result.unmount()
        client.off('error', done)
        done()
    })

    it('creates new client after disconnect', async (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent>
                <Test />
            </ClientProviderComponent>
        ))
        const { client } = currentContext
        expect(client).toBeTruthy()

        const prevClient = client
        await prevClient.ensureConnected()
        // act required as we're triggering
        // context update outside a render/mount
        act(() => {
            prevClient.ensureDisconnected()
        })
        // still want to wait for disconnection
        await prevClient.ensureDisconnected()
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

        const result = mount((
            <ClientProviderComponent>
                <Test />
            </ClientProviderComponent>
        ))
        const { client } = currentContext
        expect(client).toBeTruthy()

        const prevClient = client
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

        const result = mount((
            <ClientProviderComponent>
                <Test />
            </ClientProviderComponent>
        ))

        expect(currentContext.client).toBeTruthy()
        const { client } = currentContext
        client.once('error', done)

        client.once('disconnected', () => {
            client.off('error', done)
            expect(client.isConnected()).not.toBeTruthy()
            done()
        })

        await client.ensureConnected()
        result.unmount()
    })

    it('can create client for unauthed user', async (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent authenticationFailed>
                <Test />
            </ClientProviderComponent>
        ))
        const { client } = currentContext
        expect(client).toBeTruthy()

        const prevClient = client
        result.unmount()
        result.mount()
        expect(currentContext.client).not.toBe(prevClient)
        result.unmount()
        await prevClient.ensureDisconnected()
        await currentContext.client.ensureDisconnected()
        done()
    })
})
