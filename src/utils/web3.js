// @flow

import BN from 'bignumber.js'
import { I18n } from '@streamr/streamr-layout'

import getWeb3, { StreamrWeb3 } from '../web3/web3Provider'
import getConfig from '../web3/config'
import type { SmartContractCall } from '../flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { fromAtto } from './math'
import { ethereumNetworks } from './constants'

const tokenContractMethods = () => getContract(getConfig().token).methods

export const getEthBalance = (): Promise<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAccount) => web3.eth.getBalance(myAccount).then((balance) => BN(balance)))
        .then(fromAtto)
}

export const getDataTokenBalance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
        .then(fromAtto)
}

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const { networkId: requiredNetwork } = getConfig()
        const requiredNetworkName = ethereumNetworks[requiredNetwork]
        const currentNetworkName = ethereumNetworks[network] || `#${network}`
        if (network.toString() !== requiredNetwork.toString()) {
            throw new Error(I18n.t('validation.incorrectEthereumNetwork', {
                requiredNetworkName,
                currentNetworkName,
            }))
        }
    })

export const isMetaMaskInUse = (web3Instance: StreamrWeb3): boolean =>
    web3Instance && web3Instance.currentProvider && web3Instance.currentProvider.isMetaMask
