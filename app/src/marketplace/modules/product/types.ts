import type { ErrorFromApi, PayloadAction } from '$shared/types/common-types'
import type { ProjectId, Subscription } from '../../types/project-types'
export type ProductIdAction = PayloadAction<{
    id: ProjectId
}>
export type ProductIdActionCreator = (arg0: ProjectId) => ProductIdAction
export type ProductErrorAction = PayloadAction<{
    id: ProjectId
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProjectId, error: ErrorFromApi) => ProductErrorAction
export type ProductSubscriptionAction = PayloadAction<{
    id: ProjectId
    subscription: Subscription
}>
export type ProductSubscriptionActionCreator = (id: ProjectId, subscription: Subscription) => ProductSubscriptionAction
