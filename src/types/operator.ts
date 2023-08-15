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
    metadata?: object
    owner: string
}

export type OperatorStake = {
    operatorId: string
    date: string
    amount: BN
    allocated: BN
    sponsorship: OperatorSponsorship
}

export type OperatorDelegator = {
    operatorId?: string
    amount: BN
}

export type OperatorSponsorship = {
    spotApy: number
}
