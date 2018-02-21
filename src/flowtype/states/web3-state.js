// @flow

import type {EthereumNetwork, Hash, Address} from '../web3-types'

export type Web3State = {
    currentAddress: ?Address,
    network: ?EthereumNetwork,
    fetching: boolean,
    creatingTransaction: boolean,
    executingTransactions: Array<Hash>,
    clickCount: ?number
}