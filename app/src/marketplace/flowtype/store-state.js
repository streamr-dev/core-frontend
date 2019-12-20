// @flow

import { purchaseFlowSteps, publishFlowSteps, saveProductSteps } from '../utils/constants'

import TransactionError from '$shared/errors/TransactionError'
import type { CategoryIdList } from './category-types'
import type {
    EditProduct,
    ProductId,
    ProductIdList,
    Filter,
    Subscription,
    ProductPermissions,
    CommunityId,
} from './product-types'
import type { Hash, Address, HashList } from '$shared/flowtype/web3-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import type { Purchase } from './common-types'
import type { ErrorInUi, TransactionState, NumberString } from '$shared/flowtype/common-types'
import type { Filter as UserpagesFilter } from '$userpages/flowtype/common-types'

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
    filter: ?UserpagesFilter,
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
    productPermissions: ProductPermissions,
}

// contract product
export type ContractProductState = {
    id: ?ProductId,
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
}

// Community product
export type CommunityProductState = {
    id: ?CommunityId,
    fetching: boolean,
    error: ?ErrorInUi,
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
    // DATA
    dataAllowance: NumberString,
    pendingDataAllowance: ?NumberString,
    gettingDataAllowance: boolean,
    getDataAllowanceError: ?ErrorInUi,
    settingDataAllowance: boolean,
    setDataAllowanceTx: ?Hash,
    setDataAllowanceError: ?ErrorInUi,
    resettingDataAllowance: boolean,
    resetDataAllowanceTx: ?Hash,
    resetDataAllowanceError: ?ErrorInUi,
    // DAI
    daiAllowance: NumberString,
    pendingDaiAllowance: ?NumberString,
    gettingDaiAllowance: boolean,
    getDaiAllowanceError: ?ErrorInUi,
    settingDaiAllowance: boolean,
    setDaiAllowanceTx: ?Hash,
    setDaiAllowanceError: ?ErrorInUi,
    resettingDaiAllowance: boolean,
    resetDaiAllowanceTx: ?Hash,
    resetDaiAllowanceError: ?ErrorInUi,
}

// web3
export type Web3State = {
    accountId: ?Address,
    error: ?ErrorInUi,
    enabled: boolean,
    ethereumNetworkId: ?NumberString,
}

// global things
export type GlobalState = {
    dataPerUsd: ?NumberString,
    ethereumNetworkIsCorrect: ?boolean,
    checkingNetwork: boolean,
    fetchingDataPerUsdRate: boolean,
    dataPerUsdRateError: ?TransactionError,
    ethereumNetworkError: ?TransactionError,
}

// transactions
export type TransactionsState = {
    pending: HashList,
    completed: HashList,
}

// all combined
export type StoreState = {
    allowance: AllowanceState,
    categories: CategoryState,
    contractProduct: ContractProductState,
    communityProduct: CommunityProductState,
    createContractProduct: ModifyContractProductState,
    editProduct: EditProductState,
    global: GlobalState,
    myProductList: MyProductListState,
    myPurchaseList: MyPurchaseListState,
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
    web3: Web3State,
    transactions: TransactionsState,
}
