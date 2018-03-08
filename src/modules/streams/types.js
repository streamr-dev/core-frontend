// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {StreamIdList} from '../../flowtype/stream-types'
import type {ProductId} from '../../flowtype/product-types'

export type StreamIdsByProductIdAction = PayloadAction<{
    id: ProductId,
    streams: StreamIdList,
}>
export type StreamIdsByProductIdActionCreator = (id: ProductId, streams: StreamIdList) => StreamIdsByProductIdAction
