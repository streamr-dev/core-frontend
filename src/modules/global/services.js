// @flow

import BN from 'bignumber.js'
import { getContract, call, checkEthereumNetworkIsCorrect as checkEthereumNetworkIsCorrectUtil } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { toNano } from '../../utils/price'
import type { NumberString } from '../../flowtype/common-types'

const marketplaceContract = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode)

export const getDataPerUsd = (): SmartContractCall<NumberString> => call(marketplaceContract(true).methods.dataPerUsd())
    .then((weiPerNanoDollar: NumberString) => {
        const dataWei = BN(weiPerNanoDollar)
        const nanoDollars = BN(toNano('1'))
        return dataWei.dividedBy(nanoDollars).toString()
    })

export const checkEthereumNetworkIsCorrect = (): Promise<void> => checkEthereumNetworkIsCorrectUtil(getWeb3())
