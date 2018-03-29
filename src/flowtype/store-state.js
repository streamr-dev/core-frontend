// @flow

import type {CategoryIdList, CategoryEntities} from './category-types'
import type {Product, ProductId, ProductIdList, ProductEntities, Filter} from './product-types'
import type {UserToken} from './user-types'
import type {StreamIdList, StreamEntities} from './stream-types'
import type {ErrorInUi, Purchase} from './common-types'
import { purchaseFlowSteps } from '../utils/constants'

// categories
export type CategoryState = {
    ids: CategoryIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// products
export type ProductListState = {
    ids: ProductIdList,
    filter: Filter,
    fetching: boolean,
    error: ?ErrorInUi,
}

// product
export type ProductState = {
    id: ?ProductId,
    fetchingProduct: boolean,
    productError: ?ErrorInUi,
    streams: StreamIdList,
    fetchingStreams: boolean,
    streamsError: ?ErrorInUi,
}

// user
export type UserState = {
    token: ?UserToken,
    fetchingToken: boolean,
    tokenError: ?ErrorInUi,
}

// streams
export type StreamsState = {
    ids: StreamIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// entities
export type EntitiesState = {
    products?: ProductEntities,
    categories?: CategoryEntities,
    streams?: StreamEntities,
}

// ui state
export type PurchaseStep = $Values<typeof purchaseFlowSteps>

export type PurchaseUiState = {
    productId: ?ProductId,
    step: PurchaseStep,
    waiting: boolean,
    data: ?Purchase,
}

// create product
export type CreateProductState = {
    product: ?Product,
    sending: boolean,
    error: ?ErrorInUi,
}

export type StoreState = {
    productList: ProductListState,
    product: ProductState,
    categories: CategoryState,
    entities: EntitiesState,
    user: UserState,
    purchase: PurchaseUiState,
    streams: StreamsState,
    createProduct: CreateProductState,
}
