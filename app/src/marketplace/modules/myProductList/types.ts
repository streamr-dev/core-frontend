import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import type { ProductId, ProductIdList } from '../../types/product-types'
export type MyProductIdAction = PayloadAction<{
    id: ProductIdList
}>
export type MyProductIdActionCreator = (arg0: ProductId) => MyProductIdAction
export type MyProductsAction = PayloadAction<{
    products: ProductIdList
}>
export type MyProductsActionCreator = (products: ProductIdList) => MyProductsAction
export type MyProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyProductsErrorActionCreator = (filter: Filter) => MyProductsErrorAction
export type MyProductsFilterAction = PayloadAction<{
    filter: Filter
}>
export type MyProductsFilterActionCreator = (filter: Filter) => MyProductsFilterAction
