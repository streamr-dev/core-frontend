export type SponsorshipElement = {
    id: string
    streamId: string
    streamDescription?: string
    payoutPerDay: string
    operators: number
    totalStake: string
    apy: number
    fundedUntil: string
    active: boolean
    stakes: SponsorshipStake[]
    cumulativeSponsoring: string
    minimumStake: string
    minimumStakingPeriodSeconds: string
}

export type SponsorshipStake = {
    operatorId: string
    joinTimestamp: string
    amountWei: string
}

export type TokenAndBalanceForSponsorship = {
    balance: string
    tokenSymbol: string
    tokenDecimals: number
}
