import { PayloadAction, ErrorInUi } from '$shared/types/common-types'
import { ProjectId, ProjectIdList } from '../../types/project-types'
export type relatedProductIdAction = PayloadAction<{
    id: ProjectIdList
}>
export type relatedProductIdActionCreator = (arg0: ProjectId) => relatedProductIdAction
export type RelatedProductsAction = PayloadAction<{
    products: ProjectIdList
}>
export type RelatedProductsActionCreator = (products: ProjectIdList) => RelatedProductsAction
export type RelatedProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type RelatedProductsErrorActionCreator = (error: ErrorInUi) => RelatedProductsErrorAction
