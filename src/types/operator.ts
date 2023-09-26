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
    valueWithoutEarnings: BN
    totalStakeInSponsorshipsWei: BN
    dataTokenBalance: BN
    poolValueTimestamp: string
    poolValueBlockNumber: string
    operatorTokenTotalSupply: BN
    exchangeRate: BN
    metadata?: OperatorMetadata
    owner: string
    nodes: string[]
    slashingEvents: OperatorSlashingEvent[]
    cumulativeProfitsWei: BN
    cumulativeOperatorsCutWei: BN
    operatorsCutFraction: BN
    queueEntries: OperatorQueueEntry[]
}

export type OperatorStake = {
    operatorId: string
    joinDate: string
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

export type OperatorQueueEntry = {
    amount: BN
    date: string
    delegator: string
    id: string
}

export type OperatorMetadata = {
    name?: string
    description?: string
    imageUrl?: string
    imageIpfsCid?: string
    redundancyFactor?: number
}
