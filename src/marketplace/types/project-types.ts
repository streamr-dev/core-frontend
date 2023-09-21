import { $ElementType, $Keys } from 'utility-types'
import { projectStates } from '~/shared/utils/constants'
import { ProjectType } from '~/shared/types'
import { NumberString } from '~/shared/types/common-types'
import { TimeUnit } from '~/shared/utils/timeUnit'
import { BN } from '~/utils/bn'

export type ProjectId = string
export type ChainName = string
export type ProjectState = $Keys<typeof projectStates>

export type SalePoint = {
    chainId: number
    beneficiaryAddress?: string
    pricePerSecond: BN | undefined // the value kept in this field should be multiplied by token's decimals
    timeUnit: TimeUnit | null | undefined
    price: BN | undefined
    pricingTokenAddress: string | undefined
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
    streams: string[]
    type: ProjectType
    termsOfUse: TermsOfUse
    contact: ContactDetails | null | undefined
    creator: string
    // Paid project & Data Union
    salePoints?: Record<ChainName, SalePoint>
    // Data union
    adminFee?: string
    existingDUAddress?: string
    dataUnionChainId?: number
    isDeployingNewDU?: boolean // field used only when creating a new project
}
export type ProjectSubscriptionId = string
export type ProjectSubscriptionIdList = Array<ProjectSubscriptionId>
export type ProjectSubscription = {
    id: ProjectSubscriptionId
    address?: string
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
    beneficiaryAddress: string
    pricePerSecond: NumberString
    minimumSubscriptionInSeconds: number
    state: $ElementType<Project, 'state'>
    chainId: number
    pricingTokenAddress: string
    pricingTokenDecimals: number // this isn't actually stored on the contract but we need it to piggyback information
}
export type WhitelistStatus = 'added' | 'removed' | 'subscribed'
export type WhitelistedAddress = {
    address: string
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
export type MemberCount = {
    total: number
    active: number
    inactive: number
}
export type DataUnion = {
    id: string
    adminFee: number | string
    owner: string
}
export type DataUnionStat = {
    id: string
    memberCount: MemberCount
    totalEarnings: number
}

export type DataUnionSecretId = string
export type DataUnionSecret = {
    id: DataUnionSecretId
    name: string
    secret: string
    contractAddress: string
}

export type PricingData = {
    tokenAddress: string | undefined
    price: BN | undefined
    pricePerSecond: BN | undefined
    timeUnit: TimeUnit | undefined
    beneficiaryAddress?: string | undefined
}
