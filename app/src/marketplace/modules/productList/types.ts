import type { ErrorInUi, PayloadAction } from '$shared/types/common-types'
import type { ProductId, ProductIdList, Filter } from '../../types/product-types'
export type ProductIdAction = PayloadAction<{
    id: ProductId
}>
export type ProductIdActionCreator = (arg0: ProductId) => ProductIdAction
export type ProductsAction = PayloadAction<{
    products: ProductIdList
    hasMore: boolean
}>
export type ProductsActionCreator = (products: ProductIdList, hasMore: boolean) => ProductsAction
export type ProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type ProductsErrorActionCreator = (error: ErrorInUi) => ProductsErrorAction
export type FilterAction = PayloadAction<{
    filter: Filter
}>
export type FilterActionCreator = (filter: Filter) => FilterAction
