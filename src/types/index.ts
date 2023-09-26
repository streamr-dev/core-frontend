import { ParsedOperator } from '~/parsers/OperatorParser'
import { TheGraph } from '~/shared/types'
import { BN } from '~/utils/bn'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
    owner?: string | undefined
}

export interface Delegation extends ParsedOperator {
    apy: number
    myShare: BN
}

export interface DelegacyStats {
    value: BN
    minApy: number
    maxApy: number
    numOfOperators: number
}

export enum TimePeriod {
    SevenDays = '7d',
    OneMonth = '30d',
    ThreeMonths = '90d',
    OneYear = '365d',
    YearToDate = 'ytd',
    All = 'all',
}

export function isTimePeriod(value: string): value is TimePeriod {
    return Object.prototype.hasOwnProperty.call(TimePeriod, value)
}
