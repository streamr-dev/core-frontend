// @flow

import { getContract, call, checkEthereumNetworkIsCorrect as checkEthereumNetworkIsCorrectUtil } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { fromAtto } from '../../utils/math'

const marketplaceContract = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode)

export const getDataPerUsd = (): SmartContractCall<number> => call(marketplaceContract(true).methods.dataPerUsd())
    .then(fromAtto)

export const checkEthereumNetworkIsCorrect = (): Promise<void> => checkEthereumNetworkIsCorrectUtil(getWeb3())
