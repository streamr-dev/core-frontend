// @flow

import type {EthereumNetwork, Address} from '../web3-types'

export type Web3State = {
    web3Enabled: ?boolean,
    network: ?EthereumNetwork,
    fetching: boolean,
    creatingTransaction: boolean,
    executingTransactions: Array<Address>,
    clickCount: ?number
}