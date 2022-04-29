// @flow

import EventEmitter from 'events'

import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import type StreamrWeb3Type from '$utils/web3/StreamrWeb3'
import { areAddressesEqual } from '$mp/utils/smartContract'
import type { NumberString } from '$shared/flowtype/common-types'
import { hasTransactionCompleted } from '$shared/utils/web3'
import { getTransactionsFromSessionStorage } from '$shared/utils/transactions'
import TransactionError from '$shared/errors/TransactionError'
import getChainId from '$utils/web3/getChainId'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

export const events = {
    ACCOUNT: 'WEB3POLLER/ACCOUNT',
    ACCOUNT_ERROR: 'WEB3POLLER/ACCOUNT_ERROR',
    NETWORK: 'WEB3POLLER/NETWORK',
    NETWORK_ERROR: 'WEB3POLLER/NETWORK_ERROR',
    TRANSACTION_COMPLETE: 'WEB3POLLER/TRANSACTION_COMPLETE',
    TRANSACTION_ERROR: 'WEB3POLLER/TRANSACTION_ERROR',
}

export type Event = $Values<typeof events>
export type Handler = (any, any) => void | Promise<void>

const WEB3_POLL_INTERVAL = 1000 // 1s
const NETWORK_POLL_INTERVAL = 1000 // 1s
const PENDING_TX_POLL_INTERVAL = 1000 * 5 // 5s

let lastWarning = ''

function warnOnce(error) {
    // do not print warning if same as last warning
    if (error.message) {
        if (lastWarning === error.message) { return }
        lastWarning = error.message
    }
    console.warn(error)
}

class CancelError extends Error {
    __proto__: any

    constructor() {
        super('Cancelled')
        this.__proto__ = CancelError.prototype // eslint-disable-line no-proto
    }
}

export default class Web3Poller {
    web3PollTimeout: ?TimeoutID = null
    ethereumNetworkPollTimeout: ?TimeoutID = null
    pendingTransactionsPollTimeout: ?TimeoutID = null
    web3: StreamrWeb3Type = getWeb3()
    account: any = null
    networkId: ?NumberString = ''
    emitter: EventEmitter = new EventEmitter()

    constructor() {
        // Start polling for info
        this.pollWeb3()
        this.pollEthereumNetwork()
        this.pollPendingTransactions()
    }

    subscribe(event: Event, handler: Handler) {
        this.emitter.on(event, handler)
    }

    unsubscribe(event: Event, handler: Handler) {
        this.emitter.removeListener(event, handler)
    }

    startWeb3Poll = () => {
        this.clearWeb3Poll()
        this.web3PollTimeout = setTimeout(this.pollWeb3, WEB3_POLL_INTERVAL)
    }

    pollWeb3 = () => (
        this.fetchWeb3Account()
            .then(this.startWeb3Poll, (error) => {
                warnOnce(error)
                this.startWeb3Poll()
            })
    )

    startEthereumNetworkPoll = () => {
        this.clearEthereumNetworkPoll()
        this.ethereumNetworkPollTimeout = setTimeout(this.pollEthereumNetwork, NETWORK_POLL_INTERVAL)
    }

    pollEthereumNetwork = () => (
        this.fetchChosenEthereumNetwork()
            .then(this.startEthereumNetworkPoll, (error) => {
                warnOnce(error)
                this.startEthereumNetworkPoll()
            })
    )

    clearWeb3Poll = () => {
        if (this.web3PollTimeout) {
            clearTimeout(this.web3PollTimeout)
            this.web3PollTimeout = null
        }
    }

    clearEthereumNetworkPoll = () => {
        if (this.ethereumNetworkPollTimeout) {
            clearTimeout(this.ethereumNetworkPollTimeout)
            this.ethereumNetworkPollTimeout = null
        }
    }

    clearPendingTransactionsPoll = () => {
        if (this.pendingTransactionsPollTimeout) {
            clearTimeout(this.pendingTransactionsPollTimeout)
            this.pendingTransactionsPollTimeout = null
        }
    }

    fetchWeb3Account = () => (
        getDefaultWeb3Account(this.web3)
            .then((account) => {
                this.handleAccount(account)
                // needed to avoid warnings about creating promise inside a handler
                // if any other web3 actions are dispatched.
                return Promise.resolve()
            }, (err) => {
                if (this.account) {
                    this.account = null
                    this.emitter.emit(events.ACCOUNT_ERROR, err)
                }
            })
    )

    handleAccount = (account: string) => {
        const next = account

        const didChange = !!(this.account && next && !areAddressesEqual(this.account, next))
        const didDefine = !!(!this.account && next)

        // Check current provider so that account event is not sent prematurely
        // (ie. wait for user to approve access to Metamask)
        if (this.web3.currentProvider !== null && (didDefine || didChange)) {
            this.account = next
            this.emitter.emit(events.ACCOUNT, next)
        }
    }

    fetchChosenEthereumNetwork = () => {
        const fetchPromise = getChainId(this.web3)

        // make sure getting the network does not hang longer than the poll timeout
        const cancelPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new CancelError()), NETWORK_POLL_INTERVAL)
        })

        return Promise.race([fetchPromise, cancelPromise])
            .then((network) => {
                this.handleNetwork(network || '')
            }, (err) => {
                if (!(err instanceof CancelError) && this.networkId) {
                    this.networkId = null
                    this.emitter.emit(events.NETWORK_ERROR, err)
                }
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

    startPendingTransactionsPoll = () => {
        this.clearPendingTransactionsPoll()
        this.pendingTransactionsPollTimeout = setTimeout(this.pollPendingTransactions, PENDING_TX_POLL_INTERVAL)
    }

    pollPendingTransactions = () => (
        this.handlePendingTransactions()
            .then(this.startPendingTransactionsPoll, (error) => {
                warnOnce(error)
                this.startPendingTransactionsPoll()
            })
    )

    handlePendingTransactions = () => {
        const web3 = getPublicWeb3()

        return Promise.all(Object.keys(getTransactionsFromSessionStorage()).map(async (txHash) => {
            let completed
            let receipt
            try {
                completed = await hasTransactionCompleted(txHash)
                receipt = !!completed && await web3.eth.getTransactionReceipt(txHash)
            } catch (err) {
                warnOnce(err)
                return // bail out
            }

            // Sometimes the receipt will be empty even if the call succeeds.
            // If so, the next interval should receive it.
            if (completed && receipt) {
                if (receipt.status === true) {
                    this.emitter.emit(
                        events.TRANSACTION_COMPLETE,
                        txHash,
                        receipt,
                    )
                } else {
                    this.emitter.emit(
                        events.TRANSACTION_ERROR,
                        txHash,
                        new TransactionError('Transaction failed', receipt),
                    )
                }
            }
        }))
    }
}
