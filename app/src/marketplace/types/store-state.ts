import type { Hash, Address, HashList } from '$shared/types/web3-types'
import type { StreamIdList } from '$shared/types/stream-types'
import type { ErrorInUi, NumberString } from '$shared/types/common-types'
import type { Filter as UserpagesFilter } from '$userpages/types/common-types'
import type { ProductId, ProductIdList, Filter, Subscription, DataUnionId, DataUnionSecretId } from './product-types'
import type { CategoryIdList } from './category-types'
// categories
export type CategoryState = {
    ids: CategoryIdList
    fetching: boolean
    error: ErrorInUi | null | undefined
}
// products
export type ProductListState = {
    ids: ProductIdList
    filter: Filter
    fetching: boolean
    error: ErrorInUi | null | undefined
    pageSize: number
    offset: number
    hasMoreSearchResults: boolean | null | undefined
}
// my products
export type MyProductListState = {
    ids: ProductIdList
    fetching: boolean
    error: ErrorInUi | null | undefined
}
// my purchases
export type MyPurchaseListState = {
    products: ProductIdList
    subscriptions: ProductIdList
    fetching: boolean
    error: ErrorInUi | null | undefined
    filter: UserpagesFilter | null | undefined
}
// related products
export type RelatedProductListState = {
    ids: ProductIdList
    fetching: boolean
    error: ErrorInUi | null | undefined
}
// product
export type ProductState = {
    fetchingContractSubscription: boolean
    contractSubscriptionError: ErrorInUi | null | undefined
    contractSubscription: Subscription | null | undefined
}
// contract product
export type ContractProductState = {
    id: ProductId | null | undefined
    fetchingContractProduct: boolean
    contractProductError: ErrorInUi | null | undefined
    whitelistedAddresses: Array<Address>
}
// Data union
export type DataUnionState = {
    id: DataUnionId | null | undefined
    fetching: boolean
    requested: Array<DataUnionId>
    ready: Array<DataUnionId>
    fetchingStats: Array<DataUnionId>
    secrets: Array<DataUnionSecretId>
}
// streams
export type StreamsState = {
    ids: StreamIdList
    fetching: boolean
}
// Purchase
export type PurchaseState = {
    productId: ProductId | null | undefined
    processing: boolean
    error: ErrorInUi | null | undefined
    purchaseTx: Hash | null | undefined
}
// Allowance
export type AllowanceState = {
    // DATA
    dataAllowance: NumberString
    pendingDataAllowance: NumberString | null | undefined
    gettingDataAllowance: boolean
    getDataAllowanceError: ErrorInUi | null | undefined
    settingDataAllowance: boolean
    setDataAllowanceTx: Hash | null | undefined
    setDataAllowanceError: ErrorInUi | null | undefined
    resettingDataAllowance: boolean
    resetDataAllowanceTx: Hash | null | undefined
    resetDataAllowanceError: ErrorInUi | null | undefined
    // DAI
    daiAllowance: NumberString
    pendingDaiAllowance: NumberString | null | undefined
    gettingDaiAllowance: boolean
    getDaiAllowanceError: ErrorInUi | null | undefined
    settingDaiAllowance: boolean
    setDaiAllowanceTx: Hash | null | undefined
    setDaiAllowanceError: ErrorInUi | null | undefined
    resettingDaiAllowance: boolean
    resetDaiAllowanceTx: Hash | null | undefined
    resetDaiAllowanceError: ErrorInUi | null | undefined
}
// web3
export type Web3State = {
    accountId: Address | null | undefined
    error: ErrorInUi | null | undefined
    enabled: boolean
    ethereumNetworkId: NumberString | null | undefined
}
// global things
export type GlobalState = {
    networkId: string | null | undefined
}
// transactions
export type TransactionsState = {
    pending: HashList
    completed: HashList
}
// all combined
export type StoreState = {
    allowance: AllowanceState
    categories: CategoryState
    contractProduct: ContractProductState
    dataUnion: DataUnionState
    global: GlobalState
    myProductList: MyProductListState
    myPurchaseList: MyPurchaseListState
    product: ProductState
    productList: ProductListState
    purchase: PurchaseState
    relatedProducts: RelatedProductListState
    streams: StreamsState
    web3: Web3State
    transactions: TransactionsState
}
