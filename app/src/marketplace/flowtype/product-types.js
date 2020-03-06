// @flow

import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import type { CategoryId } from './category-types'
import type { StreamIdList, StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi, ContractCurrency as Currency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'

export type ProductId = string
export type ProductState = $Keys<typeof productStates>

export type ProductType = $Values<typeof productTypes>

export type PendingChanges = {
    adminFee?: number
}

export type Product = {
    adminFee?: number,
    key?: string,
    id: ?ProductId,
    name: string,
    description: string,
    owner: string,
    imageUrl: ?string,
    newImageToUpload?: ?File,
    thumbnailUrl: ?string,
    state?: ProductState,
    created?: Date,
    updated?: Date,
    category: ?CategoryId,
    streams: StreamIdList,
    previewStream: ?StreamId,
    previewConfigJson?: ?string,
    minimumSubscriptionInSeconds?: number,
    ownerAddress: Address,
    beneficiaryAddress: Address,
    pricePerSecond: NumberString,
    priceCurrency: Currency,
    timeUnit?: ?TimeUnit,
    price?: NumberString,
    isFree?: boolean,
    type?: ProductType,
    pendingChanges?: PendingChanges,
}

export type ProductSubscriptionId = string

export type ProductSubscriptionIdList = Array<ProductSubscriptionId>

export type ProductSubscription = {
    id: ProductSubscriptionId,
    address?: Address,
    user?: string,
    endsAt: Date,
    product: Product,
    dateCreated: Date,
    lastUpdated: Date,
}

export type ProductSubscriptionList = Array<ProductSubscription>

export type EditProduct = Product

export type SmartContractProduct = {
    id: ProductId,
    name: $ElementType<Product, 'name'>,
    ownerAddress: $ElementType<Product, 'ownerAddress'>,
    beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    minimumSubscriptionInSeconds: $ElementType<Product, 'minimumSubscriptionInSeconds'>,
    state: $ElementType<Product, 'state'>,
}

export type Subscription = {
    productId: ProductId,
    endTimestamp: number
}

export type ProductIdList = Array<ProductId>

export type ProductList = Array<Product>

export type ProductListPageWrapper = {
    products: ProductList,
    hasMoreProducts: boolean,
}

export type ProductEntities = {
    [ProductId]: Product,
}

export type SmartContractProductEntities = {
    [ProductId]: SmartContractProduct,
}

export type SearchFilter = string

export type CategoryFilter = CategoryId

export type SortByFilter = string

export type MaxPriceFilter = NumberString

export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter

export type Filter = {
    search: ?SearchFilter,
    categories: ?CategoryFilter,
    sortBy: ?SortByFilter,
    maxPrice: ?MaxPriceFilter,
}

export type UserProductPermissionList = {
    id?: number,
    user?: string,
    operation?: string,
    anonymous?: boolean,
}

export type ProductPermissions = {
    read: boolean,
    write: boolean,
    share: boolean,
    fetchingPermissions: boolean,
    permissionsError: ?ErrorInUi,
}

export type DataUnionId = $ElementType<Product, 'beneficiaryAddress'>

export type MemberCount = {
    total: number,
    active: number,
    inactive: number,
}

export type DataUnion = {
    id: DataUnionId,
    adminFee: number | string,
    joinPartStreamId: StreamId,
    owner: Address,
    memberCount?: MemberCount,
}
