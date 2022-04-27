// @flow

import { call } from '$mp/utils/smartContract'

import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { fromAtto } from '$mp/utils/math'
import type { NumberString } from '$shared/flowtype/common-types'
import { marketplaceContract } from '$mp/utils/web3'

export const getDataPerUsd = (chainId: number): SmartContractCall<NumberString> => (
    call(marketplaceContract(true, chainId).methods.dataPerUsd())
        .then((value) => fromAtto(value).toString())
)
