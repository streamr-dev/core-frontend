// @flow

import Web3Poller, { events, type Event, type Handler } from './web3Poller'

const poller = new Web3Poller()

class Web3PollerStatic {
    static events = events

    static subscribe(event: Event, handler: Handler) {
        poller.subscribe(event, handler)
    }

    static unsubscribe(event: Event, handler: Handler) {
        poller.unsubscribe(event, handler)
    }
}

export default Web3PollerStatic
