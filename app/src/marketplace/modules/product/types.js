// @flow

import type { PayloadAction, ErrorFromApi } from '../../flowtype/common-types'
import type { ProductId, Subscription } from '../../flowtype/product-types'
import type { StreamIdList } from '../../flowtype/stream-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProductId, error: ErrorFromApi) => ProductErrorAction

export type StreamIdsByProductIdAction = PayloadAction<{
    id: ProductId,
    streams: StreamIdList,
}>
export type StreamIdsByProductIdActionCreator = (id: ProductId, streams: StreamIdList) => StreamIdsByProductIdAction

export type ProductSubscriptionAction = PayloadAction<{
    id: ProductId,
    subscription: Subscription,
}>
export type ProductSubscriptionActionCreator = (id: ProductId, subscription: Subscription) => ProductSubscriptionAction
