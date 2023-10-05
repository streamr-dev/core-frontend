import { z } from 'zod'
import { TimeUnit } from '~/shared/utils/timeUnit'
import { ProjectPermissions } from '~/shared/consts'
import { GetProjectQuery } from '~/generated/gql/network'

export enum ProjectType {
    OpenData = 'OPEN_DATA',
    PaidData = 'PAID_DATA',
    DataUnion = 'DATA_UNION',
}

export interface SalePoint {
    beneficiaryAddress: string
    chainId: number
    enabled: boolean
    price: string
    pricePerSecond: string
    pricingTokenAddress: string
    readOnly: boolean
    timeUnit: TimeUnit
}

export type QueriedGraphProject = NonNullable<GetProjectQuery['project']>

export type ProjectPermissions = z.infer<typeof ProjectPermissions>

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
