// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {StreamId} from '../../flowtype/stream-types'

export type StreamIdAction = PayloadAction<{
    id: StreamId,
}>
export type StreamIdActionCreator = (StreamId) => StreamIdAction

export type StreamErrorAction = PayloadAction<{
    id: StreamId,
    error: ErrorFromApi
}>
export type StreamErrorActionCreator = (id: StreamId, error: ErrorFromApi) => StreamErrorAction
