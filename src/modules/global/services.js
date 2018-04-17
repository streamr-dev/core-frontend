// @flow

import BN from 'bignumber.js'
import { getContract, call, checkEthereumNetworkIsCorrect as checkEthereumNetworkIsCorrectUtil } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { toNanoDollarString } from '../../utils/price'

const marketplaceContract = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode)

export const getDataPerUsd = (): SmartContractCall<number> => call(marketplaceContract(true).methods.dataPerUsd())
    .then((weiPerNanoDollar: string) => {
        const dataWei = new BN(weiPerNanoDollar)
        const nanoDollars = new BN(toNanoDollarString(1))
        return dataWei.dividedBy(nanoDollars).toNumber()
    })

export const checkEthereumNetworkIsCorrect = (): Promise<void> => checkEthereumNetworkIsCorrectUtil(getWeb3())
