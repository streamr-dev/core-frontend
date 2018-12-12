// @flow

import BN from 'bignumber.js'
import { I18n } from 'react-redux-i18n'
import Web3 from 'web3'

import { StreamrWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { SmartContractCall, Hash } from '$shared/flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'

import { fromAtto } from './math'
import { ethereumNetworks } from '$shared/utils/constants'

declare var ethereum: Web3

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

export const isWeb3Injected = (web3Instance: StreamrWeb3): boolean =>
    web3Instance && (web3Instance.currentProvider != null)

export const hasTransactionCompleted = (txHash: Hash): Promise<boolean> => {
    const web3 = getPublicWeb3()

    return web3.eth.getTransaction(txHash)
        .then((trx) => !!trx && trx.blockNumber !== null)
}
