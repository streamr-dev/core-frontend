// import assert from 'assert-diff'
import sinon from 'sinon'

import Web3PollerClass from '$shared/web3/web3Poller/web3Poller'
import Web3Poller from '$shared/web3/web3Poller'

describe('web3Poller', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
    })

    describe('subscribe', () => {
        it('it subscribes to poller events', async () => {
            const subscribeSpy = sinon.spy(Web3PollerClass.prototype, 'subscribe')
            const handler = () => {}
            Web3Poller.subscribe(Web3Poller.events.ACCOUNT, handler)

            expect(subscribeSpy.calledOnce).toEqual(true)
            expect(subscribeSpy.calledWith(Web3Poller.events.ACCOUNT, handler)).toEqual(true)
        })
    })

    describe('unsubscribe', () => {
        it('it unsubscribes from poller events', async () => {
            const unsubscribeSpy = sinon.spy(Web3PollerClass.prototype, 'unsubscribe')
            const handler = () => {}
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, handler)

            expect(unsubscribeSpy.calledOnce).toEqual(true)
            expect(unsubscribeSpy.calledWith(Web3Poller.events.ACCOUNT, handler)).toEqual(true)
        })
    })
})
