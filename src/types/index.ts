import { config as configs } from '@streamr/config'
import { MessageID } from '@streamr/sdk'
import { TheGraph } from '~/shared/types'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
}

export interface DelegationsStats {
    value: bigint
    minApy: number
    maxApy: number
    numOfOperators: number
}

export enum ChartPeriod {
    SevenDays = '7d',
    OneMonth = '1m',
    ThreeMonths = '3m',
    OneYear = '1y',
    YearToDate = 'ytd',
    All = 'all',
}

export function isChartPeriod(value: string): value is ChartPeriod {
    return Object.values<string>(ChartPeriod).includes(value)
}

export interface XY {
    x: number
    y: number
}

export type ChainConfigKey =
    | 'maxPenaltyPeriodSeconds'
    | 'minimumStakeWei'
    | 'minimumSelfDelegationFraction'
    | 'maxQueueSeconds'
    | 'slashingFraction'
    | 'minimumDelegationSeconds'
    | 'minimumDelegationWei'
    | 'earlyLeaverPenaltyWei'

type ContractAddressKey = typeof configs extends Record<
    any,
    Record<'contracts', Partial<Record<infer K, string>>>
>
    ? K
    : never

export interface Chain {
    name: string
    id: number
    theGraphUrl?: string
    rpcEndpoints: { url: string }[]
    contracts: Partial<Record<ContractAddressKey | (string & {}), string>>
    entryPoints?: {
        nodeId: string
        websocket: {
            host: string
            port: number
            tls: boolean
        }
    }[]
    nativeCurrency: { symbol: string; name: string; decimals: number }
    blockExplorerUrl?: string
    adminPrivateKey?: string
}

export type OrderDirection = 'asc' | 'desc'

export interface DataPoint {
    data: unknown
    metadata: {
        messageId: MessageID
        timestamp: number
    }
}

export interface WritablePaymentDetail<P = bigint> {
    beneficiary: string
    pricingTokenAddress: string
    pricePerSecond: P
}

export type FundingEvent = {
    id: string
    amount: bigint
    sponsor: string
    date: string
}

export type Values<T> = T extends Record<string, infer R> ? R : never
