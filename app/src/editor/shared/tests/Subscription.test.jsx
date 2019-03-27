import React from 'react'
import uuid from 'uuid'
import { mount } from 'enzyme'
import { setup } from '$editor/shared/tests/utils'

import * as Services from '../services'
import { ClientProviderComponent, getOrCreateClient } from '../components/Client'
import Subscription from '../components/Subscription'

function throwError(err) {
    throw err
}

describe('Subscription', () => {
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

    describe('create subscription', () => {
        let client
        let stream

        beforeAll(async () => {
            client = await getOrCreateClient(apiKey)
            client.on('error', throwError)
            stream = await client.getOrCreateStream({
                name: uuid.v4(),
            })
        })

        afterAll(async () => {
            client.off('error', throwError)
            if (stream) {
                await stream.delete()
            }
            await client.disconnect()
        })

        it('can create subscription', async (done) => {
            const msg = { test: uuid() }
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        onSubscribed={() => {
                            stream.publish(msg)
                        }}
                        onMessage={(received) => {
                            expect(received).toEqual(msg)
                            result.unmount()
                        }}
                        onUnsubscribed={() => {
                            done()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        })

        it('unsubscribes on unmount', async (done) => {
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        onSubscribed={() => {
                            result.unmount()
                        }}
                        onUnsubscribed={() => {
                            done()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        })
    })
})
