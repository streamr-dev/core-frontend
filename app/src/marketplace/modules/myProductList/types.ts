import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import type { ProjectId, ProjectIdList } from '../../types/project-types'
export type MyProductIdAction = PayloadAction<{
    id: ProjectIdList
}>
export type MyProductIdActionCreator = (arg0: ProjectId) => MyProductIdAction
export type MyProductsAction = PayloadAction<{
    products: ProjectIdList
}>
export type MyProductsActionCreator = (products: ProjectIdList) => MyProductsAction
export type MyProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyProductsErrorActionCreator = (error: ErrorInUi) => MyProductsErrorAction
export type MyProductsFilterAction = PayloadAction<{
    filter: Filter
}>
export type MyProductsFilterActionCreator = (filter: Filter) => MyProductsFilterAction
