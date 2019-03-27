import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { setup } from '$editor/shared/tests/utils'

import * as Services from '../services'
import { ClientProviderComponent, ClientContext } from '../components/Client'

describe('Client', () => {
    let teardown
    let apiKey

    beforeAll(async () => {
        teardown = await setup(Services.API)
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    beforeAll(async () => {
        const [key] = await Services.API.get(`${process.env.STREAMR_API_URL}/users/me/keys`).then(Services.getData)
        apiKey = key.id
    })

    it('creates client on mount, can unmount', (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent apiKey={apiKey}>
                <Test />
            </ClientProviderComponent>
        ))

        expect(currentContext.client).toBeTruthy()
        const { client } = currentContext
        client.once('error', done)

        result.unmount()
        done()
    })

    it('reuses client', (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent apiKey={apiKey}>
                <Test />
            </ClientProviderComponent>
        ))

        expect(currentContext.client).toBeTruthy()
        const { client } = currentContext
        client.once('error', done)

        result.unmount()
        client.once('connected', done)
        result.mount()
        // should be same client instance
        expect(currentContext.client).toBe(client)
    })

    it('disconnects on unmount', (done) => {
        let currentContext
        function Test() {
            currentContext = useContext(ClientContext)
            return null
        }

        const result = mount((
            <ClientProviderComponent apiKey={apiKey}>
                <Test />
            </ClientProviderComponent>
        ))

        expect(currentContext.client).toBeTruthy()
        const { client } = currentContext
        client.once('error', (error) => {
            done(error)
        })

        client.once('disconnected', () => {
            expect(client.isConnected()).not.toBeTruthy()
            done()
        })

        if (client.isConnected()) {
            result.unmount()
        } else {
            client.once('connected', () => {
                result.unmount()
            })
        }
    })
})
