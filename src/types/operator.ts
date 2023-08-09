export type OperatorChartData = {
    totalStake: { day: number; value: number }[]
    cumulativeEarnings: { day: number; value: number }[]
}

export type OperatorStats = {
    totalStake: number
    delegators: number
    sponsorships: number
}
