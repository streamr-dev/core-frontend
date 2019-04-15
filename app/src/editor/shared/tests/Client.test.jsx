import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import api from '../utils/api'

import * as Services from '../services'
import { ClientProviderComponent, ClientContext } from '../components/Client'

describe('Client', () => {
    let teardown
    let apiKey

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    beforeAll(async () => {
        const [key] = await api().get(`${process.env.STREAMR_API_URL}/users/me/keys`).then(Services.getData)
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
        client.off('error', done)
        done()
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
        client.once('error', done)

        client.once('disconnected', () => {
            client.off('error', done)
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
