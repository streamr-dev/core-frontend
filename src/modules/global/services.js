// @flow

import { getContract, call } from '../../utils/smartContract'
import {
    checkEthereumNetworkIsCorrect as checkEthereumNetworkIsCorrectUtil,
    isWeb3Injected as isWeb3InjectedUtil,
} from '../../utils/web3'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { fromAtto } from '../../utils/math'
import type { NumberString } from '../../flowtype/common-types'

const marketplaceContract = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode)

export const getDataPerUsd = (): SmartContractCall<NumberString> => call(marketplaceContract(true).methods.dataPerUsd())
    .then((value) => fromAtto(value).toString())

export const checkEthereumNetworkIsCorrect = (): Promise<void> => (checkEthereumNetworkIsCorrectUtil(getWeb3()))

export const isWeb3Injected = (): boolean => isWeb3InjectedUtil(getWeb3())
