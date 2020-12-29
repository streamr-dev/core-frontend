// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { DataUnionId, DataUnionSecretId } from '$mp/flowtype/product-types'

export type DataUnionIdAction = PayloadAction<{
    id: DataUnionId,
}>
export type DataUnionIdActionCreator = (DataUnionId) => DataUnionIdAction

export type DataUnionIdsAction = PayloadAction<{
    ids: Array<DataUnionId>,
}>
export type DataUnionIdsActionCreator = (Array<DataUnionId>) => DataUnionIdsAction

export type DataUnionErrorAction = PayloadAction<{
    id: DataUnionId,
    error: ErrorInUi
}>
export type DataUnionErrorActionCreator = (id: DataUnionId, error: ErrorInUi) => DataUnionErrorAction

export type Secret = {
    id: string,
    name: string,
    secret: string,
}

export type DataUnionsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type DataUnionsErrorActionCreator = (error: ErrorInUi) => DataUnionsErrorAction

export type DataUnionSecretsAction = PayloadAction<{
    id: DataUnionId,
    secrets: Array<DataUnionSecretId>,
}>
export type DataUnionSecretsActionCreator = (id: DataUnionId, secrets: Array<DataUnionSecretId>) => DataUnionSecretsAction
