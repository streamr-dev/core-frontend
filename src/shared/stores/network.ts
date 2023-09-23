import moment from 'moment'
import { create } from 'zustand'
import { growingValuesGenerator } from '~/components/NetworkUtils'

function getEmptyNetworkStats() {
    return {
        totalStake: 0,
        numOfSponsorships: 0,
        numOfOperators: 0,
    }
}

function getEmptyDelegationStats() {
    return {
        value: 0,
        numOfOperators: 0,
        apy: 0,
    }
}

function getEmptyOperatorState() {
    return {
        value: 0,
        numOfDelegators: 0,
        numOfSponsorships: 0,
    }
}

function getEmptyChartData() {
    return {
        operatorStakeData: growingValuesGenerator(10, 24040218).map(
            ({ day: x, value: y }) => ({ x, y }),
        ),
        operatorEarningsData: growingValuesGenerator(10, 2000000).map(
            ({ day: x, value: y }) => ({ x, y }),
        ),
        delegationsValueData: growingValuesGenerator(10, 12300431).map(
            ({ day: x, value: y }) => ({ x, y }),
        ),
        delegationsEarningsData: growingValuesGenerator(10, 1400000).map(
            ({ day: x, value: y }) => ({ x, y }),
        ),
    }
}

interface SponsorshipManifest {
    streamId: string
    streamDescription: string
    apy: number
    payoutPerDay: string
    totalStake: string
    operators: number
    fundedUntil: string
    id: string
    active: boolean
    stakes: unknown[]
}

function getEmptySponsorships() {
    return [
        {
            streamId: 'jollygood.eth/my/funded/stream',
            streamDescription: 'Price, volume data feed for the DATAUSD',
            apy: 24.6,
            payoutPerDay: '1200',
            totalStake: '1500000',
            operators: 54,
            fundedUntil: moment().add(1, 'month').format('DD-mm-YYYY'),
            id: '45c5027a-ce52-49e2-9787-7f5599ce85cf',
            active: true,
            stakes: [],
        },
        {
            streamId: 'HSL/helsinki/trams',
            streamDescription: 'Real-time location of Helsinki trams',
            apy: 14.5,
            payoutPerDay: '4347',
            totalStake: '2300000',
            operators: 10,
            fundedUntil: moment().add(50, 'days').format('DD-mm-YYYY'),
            id: 'add2771e-111d-451a-ae50-6fb93f5da616',
            active: false,
            stakes: [],
        },
    ]
}

interface DelegationManifest {
    apy: number
    myShare: number
    operatorId: string
    operatorsCut: number
    sponsorships: number
    totalStake: number
}

function getEmptyDelegations() {
    return [
        '0x12e567661643698e7C86D3684e391D2C38950C0c',
        '0xc94E24B76DF0cF39af431c8569Ee2D45a032d680',
        '0xD59eC6CBFBe2Ee9C9c75ED7732d58d0FBeb99c1c',
        '0x304B171463A828577a39155923bbDb09c227C588',
        '0x91993A3dDD95e8b84E49B42ca1B0BA222B78477E',
        '0xAe755C61Ca8707Ca01f3EdC634C4dA5B8DA5127D',
        '0x86BBe0a84c68b2607C0830DFcDC11B7F9C880bEd',
        '0x4178812b528f88bf0B2e73EB6ba4f0C8c4cd186c',
        '0x93A717001d29cA011449C6CA1e5042c285c12f37',
    ].map((operatorId) => ({
        operatorId,
        apy: Math.round(40 * Math.random()),
        myShare: Math.round(3500000 * Math.random()),
        operatorsCut: Math.round(30 * Math.random()),
        sponsorships: Math.round(25 * Math.random()),
        totalStake: Math.round(15000000 * Math.random()),
    }))
}

interface XY {
    x: number
    y: number
}

interface NetworkStore {
    networkStats: {
        totalStake: number
        numOfSponsorships: number
        numOfOperators: number
    }
    operatorStats: {
        value: number
        numOfDelegators: number
        numOfSponsorships: number
    }
    delegationStats: {
        value: number
        numOfOperators: number
        apy: number
    }
    chartData: {
        operatorStakeData: XY[]
        operatorEarningsData: XY[]
        delegationsValueData: XY[]
        delegationsEarningsData: XY[]
    }
    sponsorships: SponsorshipManifest[]
    delegations: DelegationManifest[]
}

const useNetworkStore = create<NetworkStore>((set, get) => {
    return {
        chartData: getEmptyChartData(),
        delegations: getEmptyDelegations(),
        delegationStats: getEmptyDelegationStats(),
        networkStats: getEmptyNetworkStats(),
        operatorStats: getEmptyOperatorState(),
        sponsorships: getEmptySponsorships(),
    }
})

export function useNetworkStats() {
    return useNetworkStore().networkStats
}

export function useOperatorStats() {
    return useNetworkStore().operatorStats
}

export function useDelegationStats() {
    return useNetworkStore().delegationStats
}

export function useChartData() {
    return useNetworkStore().chartData
}

export function useSponsorships() {
    return useNetworkStore().sponsorships
}

export function useDelegations() {
    return useNetworkStore().delegations
}

export function useIsOperator() {
    return true
}
