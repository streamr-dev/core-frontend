// @flow

import { purchaseFlowSteps, publishFlowSteps, saveProductSteps } from '../utils/constants'

import TransactionError from '../errors/TransactionError'
import type { CategoryIdList } from './category-types'
import type {
    EditProduct,
    ProductId,
    ProductIdList,
    Filter,
    Subscription,
} from './product-types'
import type { Hash, Address, Web3AccountList, HashList } from './web3-types'
import type { ApiKey, User, ProductPermissions } from './user-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import type { Purchase, TransactionState, Notification, NumberString } from './common-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { EntitiesState } from '$shared/flowtype/store-state'

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
    logoutError: ?ErrorInUi,
    fetchingLogout: boolean,
}

// streams
export type StreamsState = {
    ids: StreamIdList,
    fetching: boolean,
    error: ?ErrorInUi,
}

// purchase dialog
export type PurchaseStep = $Values<typeof purchaseFlowSteps>

export type PurchaseDialogState = {
    productId: ?ProductId,
    step: PurchaseStep,
    stepParams: any,
    data: ?Purchase,
}

// save product dialog
export type SaveProductStep = $Values<typeof saveProductSteps>

export type SaveProductDialogState = {
    step: SaveProductStep,
    updateFinished: boolean,
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
    productId: ?ProductId,
    processing: boolean,
    error: ?ErrorInUi,
    purchaseTx: ?Hash,
}

// Publish
export type PublishState = {
    productId: ?ProductId,
    publishingContract: boolean,
    contractTx: ?Hash,
    contractError: ?ErrorInUi,
    publishingFree: boolean,
    freeProductState: ?TransactionState,
    freeProductError: ?ErrorInUi,
    setDeploying: boolean,
    setDeployingError: ?ErrorInUi,
}

// Create or update contract product
export type ModifyContractProductState = {
    productId: ?ProductId,
    processing: boolean,
    error: ?ErrorInUi,
    modifyTx: ?Hash,
}

// Allowance
export type AllowanceState = {
    allowance: NumberString,
    pendingAllowance: ?NumberString,
    gettingAllowance: boolean,
    getAllowanceError: ?ErrorInUi,
    settingAllowance: boolean,
    setAllowanceTx: ?Hash,
    setAllowanceError: ?ErrorInUi,
    resettingAllowance: boolean,
    resetAllowanceTx: ?Hash,
    resetAllowanceError: ?ErrorInUi,
}

// web3
export type Web3State = {
    accountId: ?Address,
    error: ?ErrorInUi,
    enabled: boolean,
    ethereumNetworkId: ?NumberString,
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
    metamaskPermission: ?boolean,
    isWeb3Injected: ?boolean,
}

// transactions
export type TransactionsState = {
    pending: HashList,
    completed: HashList,
}

// i18n
export type Locale = string

export type Translations = {
    [Locale]: string | {
        language: {
            name: string,
            [string]: string,
        },
        [string]: string | {},
    },
}

export type I18nState = {
    translations: Translations,
    locale: Locale,
}

// all combined
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
    unpublish: PublishState,
    publishDialog: PublishDialogState,
    purchase: PurchaseState,
    purchaseDialog: PurchaseDialogState,
    saveProductDialog: SaveProductDialogState,
    relatedProducts: RelatedProductListState,
    streams: StreamsState,
    updateContractProduct: ModifyContractProductState,
    user: UserState,
    web3: Web3State,
    transactions: TransactionsState,
}
