import React from 'react'
import { mount } from 'enzyme'

import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import api from '$editor/shared/utils/api'
import { ClientProviderComponent, createClient } from '$shared/components/StreamrClientContextProvider'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import * as State from '$editor/canvas/state'
import * as Services from '$editor/canvas/services'

function throwError(err) {
    throw err
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('Canvas Subscriptions', () => {
    let teardown
    let apiKey

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    beforeAll(async () => {
        const [key] = await api().get(`${process.env.STREAMR_API_URL}/users/me/keys`).then(({ data }) => data)
        apiKey = key.id
    })

    describe('create subscription', () => {
        let client

        async function setup() {
            client = await createClient(apiKey)
            client.on('error', throwError)
        }

        async function teardown() {
            if (client) {
                await client.ensureDisconnected()
                client.off('error', throwError)
                client = undefined
            }
        }

        beforeEach(async () => {
            await teardown()
            await setup()
        })

        it('should get canvas module subscription messages', async (done) => {
            let canvas = await Services.create()
            canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            const table = canvas.modules.find((m) => m.name === 'Table')
            const clockDateOut = State.findModulePort(canvas, clock.hash, (p) => p.name === 'date')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
            canvas = State.updateCanvas(State.connectPorts(canvas, clockDateOut.id, tableIn1.id))
            const startedCanvas = State.updateCanvas(await Services.start(canvas))
            const runningTable = startedCanvas.modules.find((m) => m.name === 'Table')
            const messages = []

            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <ModuleSubscription
                        module={runningTable}
                        onMessage={(message) => {
                            messages.push(message)
                        }}
                        isSubscriptionActive
                    />
                </ClientProviderComponent>
            ))

            await wait(5000)
            const receivedMessages = messages.slice() // copy before unmounting
            result.unmount()
            // should have roughly 5 messages
            expect(receivedMessages.length).toBeTruthy()
            expect(receivedMessages.length >= 4).toBeTruthy()
            expect(receivedMessages.length <= 6).toBeTruthy()
            done()
        }, 15000)
    })
})
