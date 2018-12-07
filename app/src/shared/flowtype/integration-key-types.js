// @flow

import type { Address } from './web3-types'

export type IntegrationKeyId = number

export type NewIntegrationKey = {
    name: string,
    service: string,
    json: Object,
}

export type IntegrationKey = {
    id: IntegrationKeyId,
    address: ?Address,
} & NewIntegrationKey

export type IntegrationKeyIdList = Array<IntegrationKeyId>

export type IntegrationKeyList = Array<IntegrationKey>

export type IntegrationKeyEntities = {
    [IntegrationKeyId]: IntegrationKey,
}
