import Web3PollerClass from '$shared/web3/web3Poller/web3Poller'
import Web3Poller from '$shared/web3/web3Poller'

describe('web3Poller', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('subscribe', () => {
        it('it subscribes to poller events', async () => {
            const subscribeSpy = jest.spyOn(Web3PollerClass.prototype, 'subscribe')
            const handler = () => {}
            Web3Poller.subscribe(Web3Poller.events.ACCOUNT, handler)

            expect(subscribeSpy).toHaveBeenCalledTimes(1)
            expect(subscribeSpy).toBeCalledWith(Web3Poller.events.ACCOUNT, handler)
        })
    })

    describe('unsubscribe', () => {
        it('it unsubscribes from poller events', async () => {
            const unsubscribeSpy = jest.spyOn(Web3PollerClass.prototype, 'unsubscribe')
            const handler = () => {}
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, handler)

            expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
            expect(unsubscribeSpy).toBeCalledWith(Web3Poller.events.ACCOUNT, handler)
        })
    })
})
