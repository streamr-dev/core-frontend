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
    poolValue: string
    totalValueInSponsorshipsWei: string
    freeFundsWei: string
    poolValueTimestamp: string
    poolValueBlockNumber: string
    poolTokenTotalSupplyWei: string
    exchangeRate: string
    metadata?: object
    owner: string
}

export type OperatorStake = {
    operatorId: string
    date: string
    amount: string
    allocated: string
}

export type OperatorDelegator = {
    operatorId?: string
    amount: string
}
