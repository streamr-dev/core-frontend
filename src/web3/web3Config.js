// @flow

import type {Address, Abi} from '../flowtype/web3-types'

export type SmartContractConfig = {
    addressesByEnvironment: {
        [string]: Address
    },
    abi: Abi
}

module.exports = {
    requiredEthereumNetworkIdsByEnvironment: {
        production: 1,
        development: 4,
        default: 4
    },
    smartContracts: {
        marketplace: {
            addressesByEnvironment: {
                development: '0xe27ecf9cc18b5cdb90f54945b5509c19c476526a',
                default: '0xe27ecf9cc18b5cdb90f54945b5509c19c476526a'
            },
            abi: require('./abis/marketplaceAbi.json')
        }
    }
}
