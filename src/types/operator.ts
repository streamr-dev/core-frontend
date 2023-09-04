import { Sponsorship } from '~/generated/gql/network'
import { BN } from '~/utils/bn'

export type OperatorChartData = {
    totalStake: { day: number; value: number }[]
    cumulativeEarnings: { day: number; value: number }[]
}

export type OperatorStats = {
    totalStake: number
    delegators: number
    sponsorships: number
}

export type OperatorElement = {
    id: string
    stakes: OperatorStake[]
    delegators: OperatorDelegator[]
    delegatorCount: number
    poolValue: BN
    totalValueInSponsorshipsWei: BN
    freeFundsWei: BN
    poolValueTimestamp: string
    poolValueBlockNumber: string
    poolTokenTotalSupplyWei: BN
    exchangeRate: BN
    metadata?: OperatorMetadata
    owner: string
    nodes: string[]
    slashingEvents: OperatorSlashingEvent[]
    cumulativeProfitsWei: BN
    cumulativeOperatorsCutWei: BN
    operatorsCutFraction: BN
}

export type OperatorStake = {
    operatorId: string
    date: string
    amount: BN
    allocated: BN
    sponsorship?: Sponsorship | null
}

export type OperatorDelegator = {
    amount: BN
    delegator: string
}

export type OperatorSlashingEvent = {
    amount: BN
    date: string
    streamId: string | undefined
}

export type OperatorMetadata = {
    name?: string
    description?: string
    imageUrl?: string
    redundancyFactor?: number
}
