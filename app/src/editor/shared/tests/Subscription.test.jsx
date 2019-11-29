import React, { useState } from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import { act } from 'react-dom/test-utils'
import uniqueId from 'lodash/uniqueId'

import api from '../utils/api'
import * as Services from '../services'
import { ClientProviderComponent, createClient } from '$shared/contexts/StreamrClient'
import Subscription from '$shared/components/Subscription'

function throwError(err) {
    throw err
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('Subscription', () => {
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

    describe('create subscription', () => {
        let client
        let stream

        async function setup() {
            client = await createClient(apiKey)
            client.on('error', throwError)
            stream = await client.getOrCreateStream({
                name: uniqueId(),
            })
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

        afterEach(async () => {
            await teardown()
        })

        it('unsubscribes on isActive false', async (done) => {
            const Test = () => {
                const [isActive, setIsActive] = useState(true)
                return (
                    <ClientProviderComponent apiKey={apiKey}>
                        <Subscription
                            uiChannel={stream}
                            onSubscribed={() => {
                                act(() => {
                                    setIsActive(false)
                                })
                            }}
                            onUnsubscribed={() => {
                                done()
                            }}
                            isActive={isActive}
                        />
                    </ClientProviderComponent>
                )
            }

            mount(<Test />)
        }, 15000)

        it('can create subscription', async (done) => {
            const msg = { test: uniqueId() }
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
                            done()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        })

        it('unsubscribes on unmount', async (done) => {
            const sub = React.createRef()
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        ref={sub}
                        uiChannel={stream}
                        resendLast={1}
                        onResent={() => {
                            // don't unmount on subscribed as this
                            // breaks the client
                            result.unmount()
                        }}
                        onNoResend={() => {
                            sub.current.subscription.once('unsubscribed', () => {
                                done()
                            })
                            // don't care if resent or not, just unmount
                            result.unmount()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        })

        it('onNoResend works', async (done) => {
            const messages = []
            const onResending = jest.fn()
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        resendLast={2}
                        onMessage={(message) => {
                            messages.push(message)
                        }}
                        onResending={onResending}
                        onNoResend={() => {
                            expect(onResending).not.toHaveBeenCalled()
                            expect(messages).toEqual([])
                            result.unmount()
                            done()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        })

        it('can use resendLast values', async (done) => {
            const msg1 = { msg: uniqueId() }
            const msg2 = { msg: uniqueId() }
            const msg3 = { msg: uniqueId() }
            await stream.publish(msg1)
            await stream.publish(msg2)
            await stream.publish(msg3)
            const messages = []
            const onResending = jest.fn()

            await wait(10000) // wait for above messages to flush

            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        resendLast={2}
                        onMessage={(message) => {
                            messages.push(message)
                        }}
                        onResending={onResending}
                        onResent={() => {
                            // wait for messages to onMessage
                            setTimeout(() => {
                                expect(onResending).toHaveBeenCalled()
                                expect(messages).toEqual([
                                    msg2,
                                    msg3,
                                ])
                                result.unmount()
                                done()
                            }, 1000)
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        }, 15000)

        xit('can use resendLast 0', async (done) => {
            const msg1 = { msg: uniqueId() }
            const msg2 = { msg: uniqueId() }
            const msg3 = { msg: uniqueId() }
            await stream.publish(msg1)
            await stream.publish(msg2)
            const messages = []
            const onResending = jest.fn()
            const onNoResend = jest.fn()

            await wait(10000) // wait for above messages to flush

            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        resendLast={0}
                        onSubscribed={async () => {
                            await stream.publish(msg3)
                            await wait(5000)
                            expect(onResending).not.toHaveBeenCalled()
                            expect(messages).toEqual([msg3])
                            result.unmount()
                            done()
                        }}
                        onMessage={(message) => {
                            messages.push(message)
                        }}
                        onResending={onResending}
                        onNoResend={onNoResend}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        }, 20000)
    })
})
