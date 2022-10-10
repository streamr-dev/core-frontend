import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import type { ProductIdList, ProductSubscriptionIdList } from '../../types/product-types'
export type MySubscriptionsAction = PayloadAction<{
    subscriptions: ProductSubscriptionIdList
}>
export type MySubscriptionsActionCreator = (arg0: ProductSubscriptionIdList) => MySubscriptionsAction
export type MyPurchasesAction = PayloadAction<{
    products: ProductIdList
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
