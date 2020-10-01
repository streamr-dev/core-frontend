import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import mockStore from '$testUtils/mockStoreProvider'
import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import { Provider as ClientProvider } from '$shared/contexts/StreamrClient'
// eslint-disable-next-line import/no-extraneous-dependencies
import { useClient } from 'streamr-client-react'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import * as State from '$editor/canvas/state'
import * as Services from '$editor/canvas/services'

describe('Canvas Subscriptions', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    describe('message reception', () => {
        let canvas
        let runningTable

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
            runningTable = canvas.modules.find((m) => m.name === 'Table')
        }, 10001)

        afterEach(async () => {
            if (!canvas) { return }
            await Services.stop(canvas)
        }, 10002)

        it('receives the messages', (done) => {
            let client

            const ClientCatcher = () => {
                client = useClient()
                return null
            }

            const store = {
                user: {},
            }

            const result = mount((
                <Provider store={mockStore(store)}>
                    <ClientProvider>
                        <ClientCatcher />
                        <ModuleSubscription
                            module={runningTable}
                            onMessage={async ({ nr }) => {
                                if (nr) {
                                    result.unmount()
                                    await client.ensureDisconnected()
                                    done()
                                }
                            }}
                            isSubscriptionActive
                        />
                    </ClientProvider>
                </Provider>
            ))
        }, 20000)

        describe('after a restart', () => {
            beforeEach(async () => {
                // canvas is running at this point, see `beforeEach` above.
                canvas = State.updateCanvas(await Services.stop(canvas))
                canvas = State.updateCanvas(await Services.start(canvas))
            })

            it('receives the messages', (done) => {
                let client

                const ClientCatcher = () => {
                    client = useClient()
                    return null
                }

                const store = {
                    user: {},
                }

                const result = mount((
                    <Provider store={mockStore(store)}>
                        <ClientProvider>
                            <ClientCatcher />
                            <ModuleSubscription
                                module={runningTable}
                                onMessage={async ({ nr }) => {
                                    if (nr) {
                                        result.unmount()
                                        await client.ensureDisconnected()
                                        done()
                                    }
                                }}
                                isSubscriptionActive
                            />
                        </ClientProvider>
                    </Provider>
                ))
            }, 20000)
        })
    })
})
