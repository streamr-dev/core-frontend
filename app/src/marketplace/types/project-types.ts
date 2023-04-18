import BN from 'bignumber.js'
import { $ElementType, $Keys, $Values } from 'utility-types'
import { projectStates } from '$shared/utils/constants'
import { ProjectTypeEnum, projectTypes } from '$mp/utils/constants'
import { StreamIdList } from '$shared/types/stream-types'
import { NumberString, PaymentCurrency } from '$shared/types/common-types'
import { Address } from '$shared/types/web3-types'
import {TimeUnit} from "$shared/utils/timeUnit"
import { CategoryId } from './category-types'

export type ProjectId = string
export type ChainName = string
export type ProjectState = $Keys<typeof projectStates>
export type ProjectType = $Values<typeof projectTypes>

export type SalePoint = {
    chainId: number,
    beneficiaryAddress?: Address
    pricePerSecond: BN | undefined // the value kept in this field should be multiplied by token's decimals
    timeUnit: TimeUnit | null | undefined
    price: BN | undefined
    pricingTokenAddress: Address | undefined
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
    twitter?: string | null | undefined
    telegram?: string | null | undefined
    reddit?: string | null | undefined
    linkedIn?: string | null | undefined
}
export type Project = {
    key?: string
    id: ProjectId | null | undefined
    name: string
    description: string
    imageUrl?: string | null | undefined
    imageIpfsCid?: string | null | undefined
    newImageToUpload?: File | null | undefined
    streams: StreamIdList
    type: ProjectTypeEnum
    termsOfUse: TermsOfUse
    contact: ContactDetails | null | undefined
    creator: string
    // Paid project & Data Union
    salePoints?: Record<ChainName, SalePoint>
    // Data union
    adminFee?: string
    dataUnionDeployed?: boolean
    existingDUAddress?: string
    dataUnionChainId?: number
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
    beneficiaryAddress: Address
    pricePerSecond: NumberString,
    minimumSubscriptionInSeconds: number,
    state: $ElementType<Project, 'state'>
    chainId: number
    pricingTokenAddress: Address
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
export type DataUnionId = Address
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

export type PricingData = {
    tokenAddress: Address | undefined,
    price: BN | undefined,
    pricePerSecond: BN | undefined,
    timeUnit: TimeUnit | undefined,
    beneficiaryAddress?: Address | undefined
}
