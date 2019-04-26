import React from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import uniqueId from 'lodash/uniqueId'

import api from '../utils/api'
import * as Services from '../services'
import { ClientProviderComponent, createClient } from '../components/Client'
import Subscription from '../components/Subscription'

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

const TIMEOUT = 30000

describe('Subscription', () => {
    let teardown
    let apiKey

    beforeAll(async () => {
        console.log('BA1 1')
        teardown = await setupAuthorizationHeader()
        console.log('BA1 2')
    }, TIMEOUT * 2)

    afterAll(async () => {
        console.log('AA1 1')
        await teardown()
        console.log('AA1 2')
    })

    beforeAll(async () => {
        console.log('BA2 1')
        const [key] = await api().get(`${process.env.STREAMR_API_URL}/users/me/keys`).then(Services.getData)
        apiKey = key.id
        console.log('BA2 2')
    })

    describe('create subscription', () => {
        let client
        let stream

        async function setup() {
            console.log('setup 1')
            client = await createClient(apiKey)
            client.once('error', (error) => {
                console.error('CLIENTERROR', error)
            })
            console.log('setup 2')
            await new Promise(async (resolve, reject) => {
                client.once('error', reject)
                stream = await client.getOrCreateStream({
                    name: uniqueId(),
                })
                stream.once('error', (error) => {
                    console.error('STREAMERROR', error)
                })

                client.off('error', reject)
                resolve()
            })
            console.log('setup 3')
        }

        async function teardown() {
            console.log('teardown 1')
            if (client) {
                console.log('teardown 2')
                await client.ensureDisconnected()
                console.log('teardown 3')
                client = undefined
            }
            console.log('teardown 4')
        }

        beforeEach(async () => {
            console.log('beforeEach 1')
            await teardown()
            console.log('beforeEach 2')
            await setup()
            console.log('beforeEach 3')
        })

        afterEach(async () => {
            console.log('afterEach 1')
            await teardown()
            console.log('afterEach 2')
        })

        it('can create subscription', async (done) => {
            const msg = { test: uniqueId() }
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        resendLast={1}
                        onSubscribed={async () => {
                            console.log('onSubscribed1')
                            await stream.publish(msg)
                            console.log('published')
                        }}
                        onMessage={(received) => {
                            console.log('onMessage1')
                            expect(received).toEqual(msg)
                            result.unmount()
                            done()
                        }}
                        isActive
                    />
                </ClientProviderComponent>
            ))
        }, TIMEOUT * 2)

        it('unsubscribes on unmount', async (done) => {
            const sub = React.createRef()
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        ref={sub}
                        uiChannel={stream}
                        resendLast={1}
                        onError={(error) => {
                            done(error)
                            result.unmount()
                        }}
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
                        onError={(error) => {
                            done(error)
                            result.unmount()
                        }}
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
            const messages = []
            const onResending = jest.fn()
            console.log('resend 1')
            await stream.publish(msg1)
            console.log('resend 2')
            await stream.publish(msg2)
            console.log('resend 3')
            await stream.publish(msg3)
            console.log('resend 4')

            await wait(TIMEOUT / 3) // wait for above messages to flush

            console.log('resend 5')
            const result = mount((
                <ClientProviderComponent apiKey={apiKey}>
                    <Subscription
                        uiChannel={stream}
                        resendLast={2}
                        onError={(error) => {
                            done(error)
                            result.unmount()
                        }}
                        onMessage={(message) => {
                            console.log('resend 6', message)
                            messages.push(message)
                        }}
                        onResending={onResending}
                        onResent={() => {
                            console.log('resend 7', messages)
                            // wait for messages to onMessage
                            setTimeout(() => {
                                console.log('resend 8', messages)
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
        }, TIMEOUT)
    })
})
