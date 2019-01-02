// @flow

import EventEmitter from 'events'

import getWeb3 from '$shared/web3/web3Provider'
import type { StreamrWeb3 as StreamrWeb3Type } from '$shared/web3/web3Provider'
import { areAddressesEqual } from '$mp/utils/smartContract'
import type { NumberString } from '$shared/flowtype/common-types'

const events = {
    ACCOUNT: 'WEB3POLLER/ACCOUNT',
    ACCOUNT_ERROR: 'WEB3POLLER/ACCOUNT_ERROR',
    NETWORK: 'WEB3POLLER/NETWORK',
    NETWORK_ERROR: 'WEB3POLLER/NETWORK_ERROR',
}

type Event = $Values<typeof events>

const ONE_SECOND = 1000

class Web3Poller {
    web3PollTimeout: ?TimeoutID = null
    ethereumNetworkPollTimeout: ?TimeoutID = null
    web3: StreamrWeb3Type = getWeb3()
    account: any = null
    networkId: NumberString = ''
    emitter: EventEmitter = new EventEmitter()

    constructor() {
        // Start polling for info
        this.pollWeb3()
        this.pollEthereumNetwork()
    }

    subscribe(event: Event, handler: (any) => void) {
        this.emitter.on(event, handler)
    }

    unsubscribe(event: Event, handler: (any) => void) {
        this.emitter.removeListener(event, handler)
    }

    pollWeb3 = () => {
        this.fetchWeb3Account()
        this.clearWeb3Poll()
        this.web3PollTimeout = setTimeout(this.pollWeb3, ONE_SECOND)
    }

    pollEthereumNetwork = () => {
        this.fetchChosenEthereumNetwork()
        this.clearEthereumNetworkPoll()
        this.ethereumNetworkPollTimeout = setTimeout(this.pollEthereumNetwork, ONE_SECOND)
    }

    clearWeb3Poll = () => {
        if (this.web3PollTimeout) {
            clearTimeout(this.web3PollTimeout)
            this.web3PollTimeout = undefined
        }
    }

    clearEthereumNetworkPoll = () => {
        if (this.ethereumNetworkPollTimeout) {
            clearTimeout(this.ethereumNetworkPollTimeout)
            this.ethereumNetworkPollTimeout = undefined
        }
    }

    fetchWeb3Account = () => {
        this.web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account)
                // needed to avoid warnings about creating promise inside a handler
                // if any other web3 actions are dispatched.
                return Promise.resolve()
            }, (err) => {
                if (this.account !== null) {
                    this.account = null
                    this.emitter.emit(events.ACCOUNT_ERROR, err)
                }
            })
    }

    handleAccount = (account: string) => {
        const next = account

        const didChange = !!(this.account && next && !areAddressesEqual(this.account, next))
        const didDefine = !!(!this.account && next)

        if (didDefine || didChange) {
            this.account = next
            this.emitter.emit(events.ACCOUNT, next)
        }
    }

    fetchChosenEthereumNetwork = () => {
        this.web3.getEthereumNetwork()
            .then((network) => {
                this.handleNetwork(network.toString())
            }, () => {
                this.web3.getDefaultAccount()
                    .then(() => Promise.resolve(), (err) => {
                        if (this.account !== null) {
                            this.emitter.emit(events.NETWORK_ERROR, err)
                        }
                    })
            })
    }

    handleNetwork = (network: NumberString) => {
        const next = network
        const didChange = this.networkId && next && this.networkId !== next
        const didDefine = !this.networkId && next
        if (didDefine || didChange) {
            this.networkId = next
            this.emitter.emit(events.NETWORK, next)
        }
    }
}

const poller = new Web3Poller()

class Web3PollerStatic {
    static events = events

    static subscribe(event: Event, handler: (any) => void) {
        poller.subscribe(event, handler)
    }

    static unsubscribe(event: Event, handler: (any) => void) {
        poller.unsubscribe(event, handler)
    }
}

export default Web3PollerStatic
