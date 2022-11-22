import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import type { ProjectIdList, ProjectSubscriptionIdList } from '../../types/project-types'
export type MySubscriptionsAction = PayloadAction<{
    subscriptions: ProjectSubscriptionIdList
}>
export type MySubscriptionsActionCreator = (arg0: ProjectSubscriptionIdList) => MySubscriptionsAction
export type MyPurchasesAction = PayloadAction<{
    products: ProjectIdList
}>
export type MyPurchasesActionCreator = (products: ProjectIdList) => MyPurchasesAction
export type MyPurchasesErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyPurchasesErrorActionCreator = (error: ErrorInUi) => MyPurchasesErrorAction
export type MyPurchasesFilterAction = PayloadAction<{
    filter: Filter
}>
export type MyPurchasesFilterActionCreator = (filter: Filter) => MyPurchasesFilterAction
