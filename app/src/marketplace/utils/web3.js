// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'

import { StreamrWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'

import { fromAtto } from './math'

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
