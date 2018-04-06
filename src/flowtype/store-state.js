// @flow

import type { CategoryIdList, CategoryEntities } from './category-types'
import type { Product, EditProduct, ProductId, ProductIdList, ProductEntities, Filter } from './product-types'
import type { Hash, Receipt, Address } from './web3-types'
import type { UserToken } from './user-types'
import type { StreamIdList, StreamEntities } from './stream-types'
import type { ErrorInUi, Purchase } from './common-types'
import { purchaseFlowSteps } from '../utils/constants'
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

// ui state
export type PurchaseStep = $Values<typeof purchaseFlowSteps>

export type PurchaseDialogState = {
    productId: ?ProductId,
    step: PurchaseStep,
    data: ?Purchase,
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

// editProduct
export type EditProductState = {
    product: ?EditProduct,
    sending: boolean,
    error: ?ErrorInUi,
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
    hash: ?Hash,
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

// modal dialogs
export type ModalState = {
    modalName: ?string,
    modalProps: ?Object,
}

export type StoreState = {
    productList: ProductListState,
    product: ProductState,
    categories: CategoryState,
    entities: EntitiesState,
    user: UserState,
    purchaseDialog: PurchaseDialogState,
    streams: StreamsState,
    createProduct: CreateProductState,
    editProduct: EditProductState,
    purchase: PurchaseState,
    allowance: AllowanceState,
    web3: Web3State,
    modals: ModalState,
}
