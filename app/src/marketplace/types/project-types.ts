import { $ElementType, $Keys, $Values } from 'utility-types'
import { projectStates } from '$shared/utils/constants'
import { ProjectTypeEnum, projectTypes } from '$mp/utils/constants'
import type { StreamId, StreamIdList } from '$shared/types/stream-types'
import type { ContractCurrency, NumberString, PaymentCurrency, TimeUnit } from '$shared/types/common-types'
import type { Address } from '$shared/types/web3-types'
import type { CategoryId } from './category-types'

export type ProjectId = string
export type ProjectState = $Keys<typeof projectStates>
export type ProjectType = $Values<typeof projectTypes>
export type PendingChanges = {
    adminFee?: string
    requiresWhitelist?: boolean
    pricingTokenAddress?: Address
}
export type SalePoint = {
    chain: string,
    beneficiaryAddress: Address
    pricePerSecond: NumberString
    priceCurrency: ContractCurrency
    timeUnit: TimeUnit | null | undefined
    price: NumberString
    pricingTokenAddress: Address
    pricingTokenDecimals: number
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
    url?: string | null | undefined
    email?: string | null | undefined
    social1?: string | null | undefined
    social2?: string | null | undefined
    social3?: string | null | undefined
    social4?: string | null | undefined
}
export type Project = {
    adminFee?: string
    key?: string
    id: ProjectId | null | undefined
    name: string
    description: string
    owner: string
    imageUrl: string | null | undefined
    newImageToUpload?: File | null | undefined
    thumbnailUrl: string | null | undefined
    state?: ProjectState
    created?: string
    updated?: string
    streams: StreamIdList
    previewStream: StreamId | null | undefined
    previewConfigJson?: string | null | undefined
    minimumSubscriptionInSeconds?: number
    ownerAddress: Address
    type?: ProjectTypeEnum
    termsOfUse: TermsOfUse
    contact: ContactDetails | null | undefined
    // Paid project
    salePoints?: SalePoint[]
    // Data union
    chain?: string
    dataUnionDeployed?: boolean
    existingDUAddress?: string
    pricingTokenAddress?: Address
    pricingTokenDecimals?: number,
    beneficiaryAddress?: Address
    pricePerSecond?: NumberString
    priceCurrency?: ContractCurrency
    timeUnit?: TimeUnit | null | undefined
    price?: NumberString
}
export type ProjectSubscriptionId = string
export type ProjectSubscriptionIdList = Array<ProjectSubscriptionId>
export type ProjectSubscription = {
    id: ProjectSubscriptionId
    address?: Address
    user?: string
    endsAt: Date
    product: Project
    dateCreated: Date
    lastUpdated: Date
}
export type ProjectSubscriptionList = Array<ProjectSubscription>
export type SmartContractProduct = {
    id: ProjectId
    name: $ElementType<Project, 'name'>
    ownerAddress: $ElementType<Project, 'ownerAddress'>
    beneficiaryAddress: $ElementType<Project, 'beneficiaryAddress'>
    pricePerSecond: $ElementType<Project, 'pricePerSecond'>
    minimumSubscriptionInSeconds: $ElementType<Project, 'minimumSubscriptionInSeconds'>
    state: $ElementType<Project, 'state'>
    chainId: number
    pricingTokenAddress: $ElementType<Project, 'pricingTokenAddress'>
    pricingTokenDecimals: number // this isn't actually stored on the contract but we need it to piggyback information
}
export type WhitelistStatus = 'added' | 'removed' | 'subscribed'
export type WhitelistedAddress = {
    address: Address
    status: WhitelistStatus
    isPending: boolean
}
export type Subscription = {
    productId: ProjectId
    endTimestamp: number
}
export type ProjectIdList = Array<ProjectId>
export type ProjectList = Array<Project>
export type ProjectListPageWrapper = {
    products: ProjectList
    hasMoreProducts: boolean
}
export type ProjectEntities = Record<ProjectId, Project>
export type SmartContractProjectEntities = Record<ProjectId, SmartContractProduct>
export type SearchFilter = string
export type CategoryFilter = CategoryId
export type SortByFilter = string
export type ProjectTypeFilter = string
export type MaxPriceFilter = NumberString
export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter | ProjectTypeFilter
export type Filter = {
    search?: SearchFilter | null | undefined
    categories?: CategoryFilter | null | undefined
    sortBy?: SortByFilter | null | undefined
    maxPrice?: MaxPriceFilter | null | undefined
    type?: ProjectTypeFilter | null | undefined
}
export type DataUnionId = $ElementType<Project, 'beneficiaryAddress'>
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
