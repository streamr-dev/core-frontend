// @flow

import type {Category} from './category-types'
import type {Product} from './product-types'
import type {ErrorInUi} from './common-types'

export type CategoryState = {
    byId: {|
        [$ElementType<Category, 'id'>]: Category
    |},
    fetching: boolean,
    error: ?ErrorInUi,
}

export type ProductStateEntity = Product & {
    fetching?: ?boolean,
    error?: ?ErrorInUi,
}

export type ProductState = {
    byId: {
        [$ElementType<Product, 'id'>]: ProductStateEntity,
    },
    fetching: boolean,
    error: ?ErrorInUi,
}

export type StoreState = {
    product: ProductState,
    category: CategoryState,
}
