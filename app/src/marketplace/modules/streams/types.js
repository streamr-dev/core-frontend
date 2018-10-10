// @flow

import type { ErrorFromApi } from '../../flowtype/common-types'
import type { PayloadAction } from '$shared/flowtype/common-types'
import type { StreamIdList } from '../../flowtype/stream-types'

export type StreamsAction = PayloadAction<{
    streams: StreamIdList,
}>
export type StreamsActionCreator = (streams: StreamIdList) => StreamsAction

export type StreamsErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type StreamsErrorActionCreator = (error: ErrorFromApi) => StreamsErrorAction
