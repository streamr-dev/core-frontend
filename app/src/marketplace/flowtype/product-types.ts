import { $Keys, $Values, $ElementType } from 'utility-types'
import BN from 'bignumber.js'
import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import type { StreamIdList, StreamId } from '$shared/flowtype/stream-types'
import type { ContractCurrency, PaymentCurrency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { CategoryId } from './category-types'
export type ProductId = string
export type ProductState = $Keys<typeof productStates>
export type ProductType = $Values<typeof productTypes>
export type PendingChanges = {
    adminFee?: string
    requiresWhitelist?: boolean
    pricingTokenAddress?: Address
}
export type TermsOfUse = {
    commercialUse: boolean
    redistribution: boolean
    reselling: boolean
    storage: boolean
    termsName: string | null | undefined
    termsUrl: string | null | undefined
}
export type ContactDetails = {
    url: string | null | undefined
    email: string | null | undefined
    social1: string | null | undefined
    social2: string | null | undefined
    social3: string | null | undefined
    social4: string | null | undefined
}
export type Product = {
    adminFee?: string
    key?: string
    id: ProductId | null | undefined
    name: string
    description: string
    chain: string
    owner: string
    imageUrl: string | null | undefined
    newImageToUpload?: File | null | undefined
    thumbnailUrl: string | null | undefined
    state?: ProductState
    created?: Date
    updated?: Date
    category: CategoryId | null | undefined
    streams: StreamIdList
    previewStream: StreamId | null | undefined
    previewConfigJson?: string | null | undefined
    minimumSubscriptionInSeconds?: number
    ownerAddress: Address
    beneficiaryAddress: Address
    pricePerSecond: NumberString
    priceCurrency: ContractCurrency
    timeUnit?: TimeUnit | null | undefined
    price?: NumberString
    isFree?: boolean
    type?: ProductType
    requiresWhitelist?: boolean
    pendingChanges?: PendingChanges
    termsOfUse: TermsOfUse
    contact: ContactDetails | null | undefined
    dataUnionDeployed?: boolean
    pricingTokenAddress: Address
    pricingTokenDecimals: BN
}
export type ProductSubscriptionId = string
export type ProductSubscriptionIdList = Array<ProductSubscriptionId>
export type ProductSubscription = {
    id: ProductSubscriptionId
    address?: Address
    user?: string
    endsAt: Date
    product: Product
    dateCreated: Date
    lastUpdated: Date
}
export type ProductSubscriptionList = Array<ProductSubscription>
export type SmartContractProduct = {
    id: ProductId
    name: $ElementType<Product, 'name'>
    ownerAddress: $ElementType<Product, 'ownerAddress'>
    beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>
    minimumSubscriptionInSeconds: $ElementType<Product, 'minimumSubscriptionInSeconds'>
    state: $ElementType<Product, 'state'>
    requiresWhitelist: $ElementType<Product, 'requiresWhitelist'>
    chainId: number
    pricingTokenAddress: $ElementType<Product, 'pricingTokenAddress'>
    pricingTokenDecimals: number // this isn't actually stored on the contract but we need it to piggyback information
}
export type WhitelistStatus = 'added' | 'removed' | 'subscribed'
export type WhitelistedAddress = {
    address: Address
    status: WhitelistStatus
    isPending: boolean
}
export type Subscription = {
    productId: ProductId
    endTimestamp: number
}
export type ProductIdList = Array<ProductId>
export type ProductList = Array<Product>
export type ProductListPageWrapper = {
    products: ProductList
    hasMoreProducts: boolean
}
export type ProductEntities = Record<ProductId, Product>
export type SmartContractProductEntities = Record<ProductId, SmartContractProduct>
export type SearchFilter = string
export type CategoryFilter = CategoryId
export type SortByFilter = string
export type ProductTypeFilter = string
export type MaxPriceFilter = NumberString
export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter | ProductTypeFilter
export type Filter = {
    search?: SearchFilter | null | undefined
    categories?: CategoryFilter | null | undefined
    sortBy?: SortByFilter | null | undefined
    maxPrice?: MaxPriceFilter | null | undefined
    type?: ProductTypeFilter | null | undefined
}
export type DataUnionId = $ElementType<Product, 'beneficiaryAddress'>
export type MemberCount = {
    total: number
    active: number
    inactive: number
}
export type DataUnion = {
    id: DataUnionId
    adminFee: number | string
    owner: Address
}
export type DataUnionStat = {
    id: DataUnionId
    memberCount: MemberCount
    totalEarnings: number
}
export type AccessPeriod = {
    time: NumberString
    timeUnit: TimeUnit
    paymentCurrency: PaymentCurrency
    price: NumberString | null | undefined
    approxUsd: NumberString | null | undefined
}
export type DataUnionSecretId = string
export type DataUnionSecret = {
    id: DataUnionSecretId
    name: string
    secret: string
    contractAddress: Address
}
