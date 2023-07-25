import { TimeUnit } from '~/shared/utils/timeUnit'
import { GetProjectQuery } from '~/generated/gql/network'

export enum ProjectType {
    OpenData = 'OPEN_DATA',
    PaidData = 'PAID_DATA',
    DataUnion = 'DATA_UNION',
}

export interface SalePoint {
    chainId: number
    beneficiaryAddress: string
    pricePerSecond: string
    timeUnit: TimeUnit
    price: string
    pricingTokenAddress: string
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
}
