import { GetProjectQuery } from '~/generated/gql/network'
import { TimeUnit } from '~/shared/utils/timeUnit'

export enum ProjectType {
    OpenData = 'OPEN_DATA',
    PaidData = 'PAID_DATA',
    DataUnion = 'DATA_UNION',
}
export interface SalePoint {
    beneficiaryAddress: string
    chainId: number
    enabled: boolean
    price: bigint | undefined
    pricePerSecond: bigint
    pricingTokenAddress: string
    readOnly: boolean
    timeUnit: TimeUnit
}

export type QueriedGraphProject = NonNullable<GetProjectQuery['project']>

export namespace TheGraph {
    export interface DataUnion {
        id: string
        owner: string
        memberCount: number
        revenueWei: string
        creationDate: string
        chainId: number
    }

    export interface NamedDataUnion extends DataUnion {
        name?: string
    }

    export enum ProjectType {
        Open = 'openData',
        Paid = 'paidData',
        DataUnion = 'dataUnion',
    }

    export interface ProjectSubscription {
        userAddress: string
        endTimestamp?: string
    }
}
