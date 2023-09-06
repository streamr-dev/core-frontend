import { z } from 'zod'
import { TimeUnit } from '~/shared/utils/timeUnit'
import {
    GraphProject,
    GraphProjectPermissions,
    ProjectPermissions,
    ProjectSubscription,
    PaymentDetail,
} from '~/shared/consts'
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
    /**
     * @deprecated SalePoint is a draft-only entity and relies solely on
     * the `timeUnit` and `price` from which price/s can be derived.
     */
    pricePerSecond: string
    pricingTokenAddress: string
    readOnly: boolean
    timeUnit: TimeUnit
}

interface RegularProject {
    id: string | undefined
    name: string
    description: string
    imageUrl: string | undefined
    imageIpfsCid: string | undefined
    newImageToUpload: File | undefined
    streams: string[]
    type: ProjectType.OpenData | ProjectType.PaidData
    termsOfUse: {
        commercialUse?: boolean
        redistribution?: boolean
        reselling?: boolean
        storage?: boolean
        termsName: string
        termsUrl: string
    }
    contact: {
        url: string
        email: string
        twitter: string
        telegram: string
        reddit: string
        linkedIn: string
    }
    creator: string | undefined
    salePoints: Record<string, SalePoint | undefined>
}

interface DataUnionProject extends Omit<RegularProject, 'type'> {
    type: ProjectType.DataUnion
    adminFee: string | undefined
    existingDUAddress: string | undefined
    dataUnionChainId: number | undefined
}

export type Project = RegularProject | DataUnionProject

export type QueriedGraphProject = NonNullable<GetProjectQuery['project']>

export type PaymentDetail = z.infer<typeof PaymentDetail>

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

    export type Project = z.infer<typeof GraphProject>

    export type ProjectSubscription = z.infer<typeof ProjectSubscription>

    export type ProjectPermissions = z.infer<typeof GraphProjectPermissions>
}
