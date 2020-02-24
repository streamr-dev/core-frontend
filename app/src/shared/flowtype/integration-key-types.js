// @flow

import type { NumberString } from '$shared/flowtype/common-types'
import type { Address } from './web3-types'

export type IntegrationKeyId = string

export type IntegrationKey = {
    id: IntegrationKeyId,
    name: string,
    service: string,
    json: {
        address?: ?Address,
    },
}

export type IntegrationKeyIdList = Array<IntegrationKeyId>

export type IntegrationKeyList = Array<IntegrationKey>

export type IntegrationKeyEntities = {
    [IntegrationKeyId]: IntegrationKey,
}

export type Challenge = {
    challenge: string,
    expires: Date,
    id: string,
}

export const BalanceType = {
    ETH: 'ETH',
    DATA: 'DATA',
}

export type Balances = {
    [$Values<typeof BalanceType>]: NumberString,
}

export type BalanceList = {
    [Address]: Balances,
}
