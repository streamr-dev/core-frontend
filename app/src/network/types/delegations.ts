export type DelegationChartData = {
    currentValue: { day: number; value: number }[]
    cumulativeEarnings: { day: number; value: number }[]
}

export type DelegationStats = {
    currentValue: number
    operators: number
    apy: number
}
