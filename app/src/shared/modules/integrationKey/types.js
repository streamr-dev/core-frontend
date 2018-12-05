// @flow

import type { PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { Web3AccountList } from '$shared/flowtype/web3-types'

export type IntegrationKeysAction = PayloadAction<{
    ethereumIdentities: Web3AccountList,
    privateKeys: Web3AccountList,
}>
export type IntegrationKeysActionCreator = (Web3AccountList, Web3AccountList) => IntegrationKeysAction

export type IntegrationKeysErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type IntegrationKeysErrorActionCreator = (error: ErrorInUi) => IntegrationKeysErrorAction
