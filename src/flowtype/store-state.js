// @flow

import { purchaseFlowSteps, publishFlowSteps } from '../utils/constants'

import TransactionError from '../errors/TransactionError'
import type { CategoryIdList, CategoryEntities } from './category-types'
import type {
    EditProduct,
    ProductId,
    ProductIdList,
    ProductEntities,
    SmartContractProductEntities,
    Filter,
    Subscription,
} from './product-types'
import type { Hash, Receipt, Address, Web3AccountList } from './web3-types'
import type { ApiKey, User, ProductPermissions } from './user-types'
import type { StreamIdList, StreamEntities } from './stream-types'
import type { ErrorInUi, Purchase, TransactionState, Notification, NumberString } from './common-types'

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
    pageSize: number,
    offset: number,
    hasMoreSearchResults: ?boolean,
}

// my products
export type MyProductListState = {
    ids: ProductIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// my purchases
export type MyPurchaseListState = {
    ids: ProductIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// related products
export type RelatedProductListState = {
    ids: ProductIdList,
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
    fetchingContractSubscription: boolean,
    contractSubscriptionError: ?ErrorInUi,
    contractSubscription: ?Subscription,
}

// contract product
export type ContractProductState = {
    id: ?ProductId,
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
}

// user
export type UserState = {
    user: ?User,
    fetchingUserData: boolean,
    userDataError: ?ErrorInUi,
    apiKey: ?ApiKey,
    fetchingApiKey: boolean,
    apiKeyError: ?ErrorInUi,
    web3Accounts: ?Web3AccountList,
    fetchingWeb3Accounts: boolean,
    web3AccountsError: ?ErrorInUi,
    productPermissions: ProductPermissions,
    fetchingExternalLogin: boolean,
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
    contractProducts?: SmartContractProductEntities,
    myProducts?: ProductEntities,
    muPurchases?: ProductEntities,
    categories?: CategoryEntities,
    relatedProducts?: ProductEntities,
    streams?: StreamEntities,
}

// purchase dialog
export type PurchaseStep = $Values<typeof purchaseFlowSteps>

export type PurchaseDialogState = {
    productId: ?ProductId,
    step: PurchaseStep,
    data: ?Purchase,
    replacedAllowance: ?NumberString,
}

// publish dialog
export type PublishStep = $Values<typeof publishFlowSteps>

export type PublishDialogState = {
    productId: ?ProductId,
    step: PublishStep,
}

// editProduct
export type EditProductState = {
    product: ?EditProduct,
    sending: boolean,
    error: ?ErrorInUi,
    transactionState: ?TransactionState,
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
    error: ?ErrorInUi,
    transactionState: ?TransactionState,
}

// Publish
export type PublishState = {
    hash: ?Hash,
    productId: ?ProductId,
    receipt: ?Receipt,
    processing: boolean,
    error: ?ErrorInUi,
    transactionState: ?TransactionState,
    isPublish: boolean,
}

// Create or update contract product
export type ModifyContractProductState = {
    hash: ?Hash,
    productId: ?ProductId,
    receipt: ?Receipt,
    processing: boolean,
    error: ?ErrorInUi,
    transactionState: ?TransactionState,
}

// Allowance
export type AllowanceState = {
    hash: ?Hash,
    allowance: NumberString,
    pendingAllowance: ?NumberString,
    gettingAllowance: boolean,
    settingAllowance: boolean,
    receipt: ?Receipt,
    error: ?ErrorInUi,
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

// notifications
export type NotificationState = {
    notifications: Array<Notification>,
}

// global things
export type GlobalState = {
    dataPerUsd: ?NumberString,
    ethereumNetworkIsCorrect: ?boolean,
    checkingNetwork: boolean,
    fetchingDataPerUsdRate: boolean,
    dataPerUsdRateError: ?TransactionError,
    ethereumNetworkError: ?TransactionError,
    isMetaMaskInUse: ?boolean,
}

export type I18nState = {
    translations: {
        [string]: string | {},
    },
    locale: string,
}

export type StoreState = {
    allowance: AllowanceState,
    categories: CategoryState,
    contractProduct: ContractProductState,
    createContractProduct: ModifyContractProductState,
    editProduct: EditProductState,
    entities: EntitiesState,
    global: GlobalState,
    i18n: I18nState,
    modals: ModalState,
    myProductList: MyProductListState,
    myPurchaseList: MyPurchaseListState,
    notifications: NotificationState,
    product: ProductState,
    productList: ProductListState,
    publish: PublishState,
    publishDialog: PublishDialogState,
    purchase: PurchaseState,
    purchaseDialog: PurchaseDialogState,
    relatedProducts: RelatedProductListState,
    streams: StreamsState,
    updateContractProduct: ModifyContractProductState,
    user: UserState,
    web3: Web3State,
}
