import React from 'react'
import { mount } from 'enzyme'

import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import { ClientProviderComponent, createClient } from '$shared/contexts/StreamrClient'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import * as State from '$editor/canvas/state'
import * as Services from '$editor/canvas/services'
import { getToken } from '$shared/utils/sessionToken'

function throwError(err) {
    throw err
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

xdescribe('Canvas Subscriptions', () => {
    let teardown
    let sessionToken

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    beforeAll(async () => {
        sessionToken = getToken()
    })

    describe('create subscription', () => {
        let client

        async function setup() {
            client = await createClient(sessionToken)
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

        describe('should get canvas module subscription messages', () => {
            let canvas
            let runningTable
            const messages = []

            beforeEach(async () => {
                canvas = await Services.create()
                canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
                const clock = canvas.modules.find((m) => m.name === 'Clock')
                canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
                const table = canvas.modules.find((m) => m.name === 'Table')
                const clockDateOut = State.findModulePort(canvas, clock.hash, (p) => p.name === 'date')
                const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
                canvas = State.updateCanvas(State.connectPorts(canvas, clockDateOut.id, tableIn1.id))
                const startedCanvas = State.updateCanvas(await Services.start(canvas))
                runningTable = startedCanvas.modules.find((m) => m.name === 'Table')
            }, 10001)

            it('works', async () => {
                const result = mount((
                    <ClientProviderComponent sessionToken={sessionToken}>
                        <ModuleSubscription
                            module={runningTable}
                            onMessage={(message) => {
                                messages.push(message)
                            }}
                            isSubscriptionActive
                        />
                    </ClientProviderComponent>
                ))

                await wait(10000)
                const receivedMessages = messages.slice() // copy before unmounting
                result.unmount()
                const newRowMessages = receivedMessages.filter(({ nr }) => nr)
                // should have roughly 10 new row messages
                expect(newRowMessages.length).toBeTruthy()
                expect(newRowMessages.length).toBeGreaterThanOrEqual(7)
            }, 20000)

            afterEach(async () => {
                if (!canvas) { return }
                await Services.stop(canvas)
            }, 10002)
        })

        describe('should get canvas module subscription messages in restarted canvas', async () => {
            let canvas
            const messages = []
            beforeEach(async () => {
                canvas = await Services.create()
                canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
                const clock = canvas.modules.find((m) => m.name === 'Clock')
                canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
                const table = canvas.modules.find((m) => m.name === 'Table')
                const clockDateOut = State.findModulePort(canvas, clock.hash, (p) => p.name === 'date')
                const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
                canvas = State.updateCanvas(State.connectPorts(canvas, clockDateOut.id, tableIn1.id))
                canvas = State.updateCanvas(await Services.start(canvas))
                canvas = State.updateCanvas(await Services.stop(canvas))
                canvas = State.updateCanvas(await Services.start(canvas))
            }, 20000)

            it('works', async () => {
                const result = mount((
                    <ClientProviderComponent sessionToken={sessionToken}>
                        <ModuleSubscription
                            module={canvas.modules.find((m) => m.name === 'Table')}
                            onMessage={(message) => {
                                messages.push(message)
                            }}
                            isSubscriptionActive
                        />
                    </ClientProviderComponent>
                ))

                await wait(10000)
                const receivedMessages = messages.slice() // copy before unmounting
                result.unmount()
                const newRowMessages = receivedMessages.filter(({ nr }) => nr)
                // should have roughly 10 new row messages
                expect(newRowMessages.length).toBeTruthy()
                expect(newRowMessages.length).toBeGreaterThanOrEqual(7)
            }, 20000)

            afterEach(async () => {
                if (!canvas) { return }
                await Services.stop(canvas)
            }, 10000)
        })
    })
})
