// @flow

import type { PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { IntegrationKeyIdList } from '$shared/flowtype/integration-key-types'

export type IntegrationKeysAction = PayloadAction<{
    ethereumIdentities: IntegrationKeyIdList,
    privateKeys: IntegrationKeyIdList,
}>
export type IntegrationKeysActionCreator = (IntegrationKeyIdList, IntegrationKeyIdList) => IntegrationKeysAction

export type IntegrationKeysErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type IntegrationKeysErrorActionCreator = (error: ErrorInUi) => IntegrationKeysErrorAction
