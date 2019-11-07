// @flow

import { getContract, call } from '$mp/utils/smartContract'
import { checkEthereumNetworkIsCorrect as checkEthereumNetworkIsCorrectUtil } from '$shared/utils/web3'
import getConfig from '$shared/web3/config'
import getWeb3 from '$shared/web3/web3Provider'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { fromAtto } from '$mp/utils/math'
import type { NumberString } from '$shared/flowtype/common-types'

const marketplaceContract = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode)

export const getDataPerUsd = (): SmartContractCall<NumberString> => call(marketplaceContract(true).methods.dataPerUsd())
    .then((value) => fromAtto(value).toString())

export const checkEthereumNetworkIsCorrect = (): Promise<void> => (checkEthereumNetworkIsCorrectUtil(getWeb3()))
