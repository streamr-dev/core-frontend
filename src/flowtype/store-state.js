// @flow

import type {CategoryIdList, CategoryEntities} from './category-types'
import type {ProductId, ProductIdList, ProductEntities} from './product-types'
import type {ErrorInUi} from './common-types'

// categories
export type CategoryState = {
    ids: CategoryIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// products
export type ProductsState = {
    ids: ProductIdList,
    search: string,
    category: ?string,
    fetching: boolean,
    error: ?ErrorInUi,
}

// product
export type ProductState = {
    id: ProductId | null,
    fetching: boolean,
    error: ?ErrorInUi,
}

// entities
export type EntitiesState = {
    products?: ProductEntities,
    categories?: CategoryEntities,
}

export type StoreState = {
    products: ProductsState,
    product: ProductState,
    categories: CategoryState,
    entities: EntitiesState,
}
