// @flow

import BN from 'bignumber.js'
import { I18n } from '@streamr/streamr-layout'

import { StreamrWeb3 } from '../web3/web3Provider'
import getConfig from '../web3/config'
import type { SmartContractCall } from '../flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { fromAtto } from './math'
import { ethereumNetworks } from './constants'

const tokenContractMethods = () => getContract(getConfig().token).methods

export const getEthBalance = (web3Instance: StreamrWeb3): Promise<number> => (web3Instance.getDefaultAccount()
    .then((myAccount) => web3Instance.eth.getBalance(myAccount).then((balance) => BN(balance)))
    .then(fromAtto).then((result) => result.toString())
)

export const getDataTokenBalance = (web3Instance: StreamrWeb3): SmartContractCall<number> => (web3Instance.getDefaultAccount()
    .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
    .then(fromAtto).then((result) => result.toString())
)

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
