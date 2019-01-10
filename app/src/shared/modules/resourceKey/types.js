// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'
import type { ResourceKeyIdList } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export type MyResourceKeysAction = PayloadAction<{
    keys: ResourceKeyIdList,
}>
export type MyResourceKeysActionCreator = (ResourceKeyIdList) => MyResourceKeysAction

export type StreamResourceKeysAction = PayloadAction<{
    id: StreamId,
    keys: ResourceKeyIdList,
}>
export type StreamResourceKeysActionCreator = (StreamId, ResourceKeyIdList) => StreamResourceKeysAction
