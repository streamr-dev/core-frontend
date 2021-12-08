// @flow

import { getContract, call } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { fromAtto } from '$mp/utils/math'
import type { NumberString } from '$shared/flowtype/common-types'

export const getDataPerUsd = (): SmartContractCall<NumberString> => {
    const { mainnet } = getConfig()

    const marketPlaceContract = getContract(mainnet.marketplace, true)

    return call(marketPlaceContract.methods.dataPerUsd())
        .then((value) => fromAtto(value).toString())
}
