// @flow
import type {ProductState} from './product-state'
import type {CategoryState} from './category-state'

export type StoreState = {
    product: ProductState,
    category: CategoryState,
}
