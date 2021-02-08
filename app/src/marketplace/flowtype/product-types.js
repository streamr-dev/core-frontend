// @flow

import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import type { StreamIdList, StreamId } from '$shared/flowtype/stream-types'
import type {
    ContractCurrency,
    PaymentCurrency,
    NumberString,
    TimeUnit,
} from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { CategoryId } from './category-types'

export type ProductId = string
export type ProductState = $Keys<typeof productStates>

export type ProductType = $Values<typeof productTypes>

export type PendingChanges = {
    adminFee?: number,
    requiresWhitelist?: boolean,
}

export type TermsOfUse = {
    commercialUse: boolean,
    redistribution: boolean,
    reselling: boolean,
    storage: boolean,
    termsName: ?string,
    termsUrl: ?string,
}

export type ContactDetails = {
    url: ?string,
    email: ?string,
    social1: ?string,
    social2: ?string,
    social3: ?string,
    social4: ?string,
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
    priceCurrency: ContractCurrency,
    timeUnit?: ?TimeUnit,
    price?: NumberString,
    isFree?: boolean,
    type?: ProductType,
    requiresWhitelist?: boolean,
    pendingChanges?: PendingChanges,
    termsOfUse: TermsOfUse,
    contact: ?ContactDetails,
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

export type SmartContractProduct = {
    id: ProductId,
    name: $ElementType<Product, 'name'>,
    ownerAddress: $ElementType<Product, 'ownerAddress'>,
    beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    minimumSubscriptionInSeconds: $ElementType<Product, 'minimumSubscriptionInSeconds'>,
    state: $ElementType<Product, 'state'>,
    requiresWhitelist: $ElementType<Product, 'requiresWhitelist'>,
}

export type WhitelistStatus = 'added' | 'removed' | 'subscribed'

export type WhitelistedAddress = {
    address: Address,
    status: WhitelistStatus,
    isPending: boolean,
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

export type ProductTypeFilter = string

export type MaxPriceFilter = NumberString

export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter | ProductTypeFilter

export type Filter = {
    search?: ?SearchFilter,
    categories?: ?CategoryFilter,
    sortBy?: ?SortByFilter,
    maxPrice?: ?MaxPriceFilter,
    type?: ?ProductTypeFilter,
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

export type AccessPeriod = {
    time: NumberString,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    price: ?NumberString,
    approxUsd: ?NumberString,
}

export type DataUnionSecretId = string

export type DataUnionSecret = {
    id: DataUnionSecretId,
    name: string,
    secret: string,
    contractAddress: Address,
}
