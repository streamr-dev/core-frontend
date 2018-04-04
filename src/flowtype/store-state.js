// @flow

import type { CategoryIdList, CategoryEntities } from './category-types'
import type { Product, ProductId, ProductIdList, ProductEntities, Filter } from './product-types'
import type { Hash, Receipt, Address } from './web3-types'
import type { UserToken } from './user-types'
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

// create product
export type CreateProductState = {
    product: ?Product,
    sending: boolean,
    error: ?ErrorInUi,
    uploadingImage: boolean,
    imageError: ?ErrorInUi,
    imageToUpload: ?File,
}

// Purchase
export type PurchaseState = {
    hash: ?Hash,
    productId: ?ProductId,
    receipt: ?Receipt,
    processing: boolean,
    error: ?TransactionError,
}

// Token
export type AllowanceState = {
    id: ?Hash,
    allowance: number,
    pendingAllowance: number,
    gettingAllowance: boolean,
    settingAllowance: boolean,
    receipt: ?Receipt,
    getError: ?ErrorInUi,
    setError: ?TransactionError,
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
    allowance: AllowanceState,
}
