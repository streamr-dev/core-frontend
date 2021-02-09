import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { useClient } from 'streamr-client-react'
import mockStore from '$testUtils/mockStoreProvider'
import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import ClientProvider from '$shared/components/StreamrClientProvider'
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
        let result
        let client

        beforeEach(async () => {
            canvas = await Services.create()
        }, 10000)

        beforeEach(async () => {
            canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            const table = canvas.modules.find((m) => m.name === 'Table')
            const clockDateOut = State.findModulePort(canvas, clock.hash, (p) => p.name === 'date')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
            canvas = State.updateCanvas(State.connectPorts(canvas, clockDateOut.id, tableIn1.id))
        }, 10000)

        beforeEach(async () => {
            canvas = State.updateCanvas(await Services.start(canvas))
            runningTable = canvas.modules.find((m) => m.name === 'Table')
        }, 10001)

        afterEach(async () => {
            if (!canvas) { return }
            await Services.stop(canvas)
        }, 20002)

        afterEach(async () => {
            if (result) {
                const r = result
                result = undefined
                r.unmount()
            }

            if (client) {
                const currentClient = client
                client = undefined
                await currentClient.disconnect()
            }
        })

        function ClientCatcher() {
            client = useClient()
            return null
        }

        it('receives the messages', async () => {
            let resolver
            const p = new Promise((resolve) => {
                resolver = resolve
            })
            const store = {
                user: {},
            }

            await act(async () => {
                result = mount((
                    <Provider store={mockStore(store)}>
                        <ClientProvider>
                            <ClientCatcher />
                            <ModuleSubscription
                                module={runningTable}
                                onMessage={async ({ nr }) => {
                                    if (nr) {
                                        resolver()
                                    }
                                }}
                                isSubscriptionActive
                            />
                        </ClientProvider>
                    </Provider>
                ))
                await p
            })
        }, 30000)

        describe('after a restart', () => {
            beforeEach(async () => {
                // canvas is running at this point, see `beforeEach` above.
                canvas = State.updateCanvas(await Services.stop(canvas))
            }, 10000)

            beforeEach(async () => {
                canvas = State.updateCanvas(await Services.start(canvas))
            }, 10000)

            it('receives the messages', async () => {
                let resolver
                const p = new Promise((resolve) => {
                    resolver = resolve
                })
                const store = {
                    user: {},
                }

                await act(async () => {
                    result = mount((
                        <Provider store={mockStore(store)}>
                            <ClientProvider>
                                <ClientCatcher />
                                <ModuleSubscription
                                    module={runningTable}
                                    onMessage={async ({ nr }) => {
                                        if (nr) {
                                            resolver()
                                        }
                                    }}
                                    isSubscriptionActive
                                />
                            </ClientProvider>
                        </Provider>
                    ))
                    await p
                })
            }, 60000)
        })
    })
})
