// @flow

import type { CategoryIdList, CategoryEntities } from './category-types'
import type { Product, EditProduct, ProductId, ProductIdList, ProductEntities, Filter } from './product-types'
import type { Hash, Receipt, Address, Web3AccountList } from './web3-types'
import type { LoginKey, User } from './user-types'
import type { StreamIdList, StreamEntities } from './stream-types'
import type { ErrorInUi, Purchase, TransactionState } from './common-types'
import { purchaseFlowSteps, publishFlowSteps } from '../utils/constants'
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
    publishingProduct: boolean,
    publishProductError: ?ErrorInUi,
    publishTransactionState: ?TransactionState,
}

// user
export type UserState = {
    user: ?User,
    fetchingUserData: boolean,
    userDataError: ?ErrorInUi,
    fetchingLogin: boolean, // TODO: this for mock login only
    loginError: ?ErrorInUi, // TODO: this for mock login only
    loginKey: ?LoginKey,
    fetchingLoginKey: boolean,
    loginKeyError: ?ErrorInUi,
    web3Accounts: ?Web3AccountList,
    fetchingWeb3Accounts: boolean,
    web3AccountsError: ?ErrorInUi,
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

// purchase dialog
export type PurchaseStep = $Values<typeof purchaseFlowSteps>

export type PurchaseDialogState = {
    productId: ?ProductId,
    step: PurchaseStep,
    data: ?Purchase,
}

// publish dialog
export type PublishStep = $Values<typeof publishFlowSteps>

export type PublishDialogState = {
    productId: ?ProductId,
    step: PublishStep,
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
    transactionState: ?TransactionState,
}

// Allowance
export type AllowanceState = {
    hash: ?Hash,
    allowance: number,
    pendingAllowance: number,
    gettingAllowance: boolean,
    settingAllowance: boolean,
    receipt: ?Receipt,
    getError: ?ErrorInUi,
    setError: ?TransactionError,
    transactionState: ?TransactionState,
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
    publishDialog: PublishDialogState,
    streams: StreamsState,
    createProduct: CreateProductState,
    editProduct: EditProductState,
    purchase: PurchaseState,
    allowance: AllowanceState,
    web3: Web3State,
    modals: ModalState,
}
