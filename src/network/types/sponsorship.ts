export type SponsorshipElement = {
    id: string
    streamId: string
    streamDescription?: string
    DATAPerDay: string
    operators: number
    totalStake: string
    apy: number
    fundedUntil: string
    active: boolean
    stakes: SponsorshipStake[]
    minimumStake?: string
}

export type SponsorshipStake = {
    operatorId: string
    date: string
    amount: string
}
