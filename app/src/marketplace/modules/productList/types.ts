import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { ProjectId, ProjectIdList, Filter } from '../../types/project-types'
export type ProductIdAction = PayloadAction<{
    id: ProjectId
}>
export type ProductIdActionCreator = (arg0: ProjectId) => ProductIdAction
export type ProductsAction = PayloadAction<{
    products: ProjectIdList
    hasMore: boolean
}>
export type ProductsActionCreator = (products: ProjectIdList, hasMore: boolean) => ProductsAction
export type ProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type ProductsErrorActionCreator = (error: ErrorInUi) => ProductsErrorAction
export type FilterAction = PayloadAction<{
    filter: Filter
}>
export type FilterActionCreator = (filter: Filter) => FilterAction
export type ProjectsAuthorFilterAction = PayloadAction<{onlyMyProjects: boolean}>
export type ProjectsAuthorFilterActionCreator = (onlyMyProjects: boolean) => ProjectsAuthorFilterAction
