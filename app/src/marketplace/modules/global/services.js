// @flow

import { getContract, call } from '$mp/utils/smartContract'
import { getConfigForChain } from '$shared/web3/config'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { fromAtto } from '$mp/utils/math'
import type { NumberString } from '$shared/flowtype/common-types'

export const getDataPerUsd = (chainId: number): SmartContractCall<NumberString> => {
    const { marketplace } = getConfigForChain(chainId)
    const marketPlaceContract = getContract(marketplace, true, chainId)

    return call(marketPlaceContract.methods.dataPerUsd())
        .then((value) => fromAtto(value).toString())
}
