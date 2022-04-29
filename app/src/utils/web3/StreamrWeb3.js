// @flow

import Web3 from 'web3'
import getConfig from '$shared/web3/config'

type StreamrWeb3Options = {
    isLegacy?: boolean,
}

export default class StreamrWeb3 extends Web3 {
    isLegacy: boolean

    constructor(provider: any, options: StreamrWeb3Options = {}) {
        super(provider)
        this.isLegacy = options && !!options.isLegacy
        // Set number of desired confirmations for transactions.
        // This needs to be 1 for local Ganache chain. Default is 24.
        const { mainnet } = getConfig()
        this.transactionConfirmationBlocks = mainnet.transactionConfirmationBlocks
    }
}
