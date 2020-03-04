// @flow

import type { PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { IntegrationKeyId, IntegrationKeyIdList, Balances } from '$shared/flowtype/integration-key-types'
import type { Address } from '$shared/flowtype/web3-types'

export type IntegrationKeysAction = PayloadAction<{
    ethereumIdentities: IntegrationKeyIdList,
    privateKeys: IntegrationKeyIdList,
}>
export type IntegrationKeysActionCreator = (IntegrationKeyIdList, IntegrationKeyIdList) => IntegrationKeysAction

export type IntegrationKeysErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type IntegrationKeysErrorActionCreator = (error: ErrorInUi) => IntegrationKeysErrorAction

export type IntegrationKeyIdAction = PayloadAction<{
    id: IntegrationKeyId,
}>

export type IntegrationKeyIdActionCreator = (IntegrationKeyId) => IntegrationKeyIdAction

export type SetBalanceAction = PayloadAction<{
    account: Address,
    balances: Balances,
}>

export type SetBalanceActionCreator = (Address, Balances) => SetBalanceAction
