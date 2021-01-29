// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { Filter } from '$userpages/flowtype/common-types'
import type { ProductIdList, ProductSubscriptionIdList } from '../../flowtype/product-types'

export type MySubscriptionsAction = PayloadAction<{
    subscriptions: ProductSubscriptionIdList,
}>
export type MySubscriptionsActionCreator = (ProductSubscriptionIdList) => MySubscriptionsAction

export type MyPurchasesAction = PayloadAction<{
    products: ProductIdList,
}>
export type MyPurchasesActionCreator = (products: ProductIdList) => MyPurchasesAction

export type MyPurchasesErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyPurchasesErrorActionCreator = (error: ErrorInUi) => MyPurchasesErrorAction

export type MyPurchasesFilterAction = PayloadAction<{
    filter: Filter
}>
export type MyPurchasesFilterActionCreator = (filter: Filter) => MyPurchasesFilterAction
