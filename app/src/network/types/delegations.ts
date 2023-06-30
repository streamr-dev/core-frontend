export type DelegationChartData = {
    currentValue: { day: number; value: number }[]
    cumulativeEarnings: { day: number; value: number }[]
}

export type DelegationStats = {
    currentValue: number
    operators: number
    apy: number
}

export type Delegation = {
    operatorId: string
    myShare: number
    totalStake: number
    operatorsCut: number
    apy: number
    sponsorships: number
}
