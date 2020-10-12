// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { ResourceKeyIdList } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export type StreamResourceKeysAction = PayloadAction<{
    id: StreamId,
    keys: ResourceKeyIdList,
}>
export type StreamResourceKeysActionCreator = (StreamId, ResourceKeyIdList) => StreamResourceKeysAction

export type ResourceKeysErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type ResourceKeysErrorActionCreator = (error: ErrorInUi) => ResourceKeysErrorAction
