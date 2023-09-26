import { ParsedOperator } from '~/parsers/OperatorParser'
import { TheGraph } from '~/shared/types'
import { BN } from '~/utils/bn'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
    owner?: string | undefined
}

/**
 * `ParsedOperator` enhanced with `apy` and `myShare`. It is *not* Delegation
 * structure coming from the Graph directly in any way.
 */
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
    SevenDays = 'SevenDays',
    OneMonth = 'OneMonth',
    ThreeMonths = 'ThreeMonths',
    OneYear = 'OneYear',
    YearToDate = 'YearToDate',
    All = 'All',
}

export function isTimePeriod(value: string): value is TimePeriod {
    return Object.prototype.hasOwnProperty.call(TimePeriod, value)
}

export interface XY {
    x: number
    y: number
}
