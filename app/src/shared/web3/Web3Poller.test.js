import Web3Poller, { events } from '$shared/web3/Web3Poller'

describe('Web3Poller', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('blocks `new` operator', () => {
        expect(() => void new Web3Poller()).toThrow(/to interract with/)
    })

    describe('subscribe', () => {
        it('subscribes to poller events', async () => {
            const subscribeSpy = jest.spyOn(Web3Poller.prototype, 'subscribe')

            const handler = () => {}

            Web3Poller.subscribe(events.ACCOUNT, handler)

            expect(subscribeSpy).toHaveBeenCalledTimes(1)
            expect(subscribeSpy).toBeCalledWith(events.ACCOUNT, handler)
        })
    })

    describe('unsubscribe', () => {
        it('unsubscribes from poller events', async () => {
            const unsubscribeSpy = jest.spyOn(Web3Poller.prototype, 'unsubscribe')

            const handler = () => {}

            Web3Poller.unsubscribe(events.ACCOUNT, handler)

            expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
            expect(unsubscribeSpy).toBeCalledWith(events.ACCOUNT, handler)
        })
    })
})
