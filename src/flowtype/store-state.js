// @flow

import type { CategoryIdList, CategoryEntities } from './category-types'
import type { Product, ProductId, ProductIdList, ProductEntities, Filter } from './product-types'
import type { Hash, Receipt, Address } from './web3-types'
import type { LoginKey, LinkedWallets } from './user-types'
import type { StreamIdList, StreamEntities } from './stream-types'
import type { ErrorInUi } from './common-types'
import type TransactionError from '../errors/TransactionError'

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
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
}

// user
export type UserState = {
    loginKey: ?LoginKey,
    integrationKeys: ?LinkedWallets,
    fetchingLogin: boolean,
    loginError: ?ErrorInUi,
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

// create product
export type CreateProductState = {
    product: ?Product,
    sending: boolean,
    error: ?ErrorInUi,
    uploadingImage: boolean,
    imageError: ?ErrorInUi,
    imageToUpload: ?File,
}

export type PurchaseState = {
    hash: ?Hash,
    productId: ?ProductId,
    receipt: ?Receipt,
    processing: boolean,
    error: ?TransactionError,
}

// web3
export type Web3State = {
    accountId: ?Address,
    error: ?ErrorInUi,
    enabled: boolean,
}

export type StoreState = {
    productList: ProductListState,
    product: ProductState,
    categories: CategoryState,
    entities: EntitiesState,
    user: UserState,
    streams: StreamsState,
    createProduct: CreateProductState,
    web3: Web3State,
    purchase: PurchaseState,
}
