import BN from "bignumber.js"
import {TheGraphPaymentDetails, TheGraphProject} from "$app/src/services/projects"
import {ChainName, Project, SalePoint} from "$mp/types/project-types"
import {ProjectTypeEnum, projectTypes} from "$mp/utils/constants"
import {getConfigForChain} from "$shared/web3/config"
import {getMostRelevantTimeUnit} from "$mp/utils/price"
import {TimeUnit} from "$shared/types/common-types"
import {timeUnitSecondsMultiplierMap} from "$shared/utils/constants"

export const mapGraphProjectToDomainModel = (graphProject: TheGraphProject): Project => {
    return {
        id: graphProject.id,
        type: mapProjectType(graphProject),
        name: graphProject.metadata.name,
        description: graphProject.metadata.description,
        imageUrl: graphProject.metadata.imageUrl,
        streams: graphProject.streams,
        termsOfUse: {...graphProject.metadata.termsOfUse},
        contact: {...graphProject.metadata.contactDetails},
        salePoints: mapSalePoints(graphProject.paymentDetails)
    }
}

export const mapProjectType = (graphProject: TheGraphProject): ProjectTypeEnum => {
    // TODO when the TheGraphProject will have field which determines if it's a Data Union - implement a check here
    return graphProject.paymentDetails.length === 1 && graphProject.paymentDetails[0].pricePerSecond == '0'
        ? ProjectTypeEnum.OPEN_DATA
        : ProjectTypeEnum.PAID_DATA
}

export const mapSalePoints = (paymentDetails: TheGraphPaymentDetails[]): Record<ChainName, SalePoint> => {
    const salePoints: Record<ChainName, SalePoint> = {}
    paymentDetails.forEach((paymentDetail) => {
        const chainConfig = getConfigForChain(Number(paymentDetail.domainId))
        const pricePerSecondBN = new BN(paymentDetail.pricePerSecond)
        const timeUnit: TimeUnit = getMostRelevantTimeUnit(pricePerSecondBN)
        salePoints[chainConfig.name] = {
            chainId: chainConfig.id,
            pricingTokenAddress: paymentDetail.pricingTokenAddress.toLowerCase(),
            pricePerSecond: paymentDetail.pricePerSecond,
            beneficiaryAddress: paymentDetail.beneficiary.toLowerCase(),
            timeUnit,
            price: pricePerSecondBN.multipliedBy(timeUnitSecondsMultiplierMap.get(timeUnit)).toString()
        }
    })
    return salePoints
}

export const mapProjectTypeName = (projectType: ProjectTypeEnum): string => {
    switch (projectType) {
        case ProjectTypeEnum.OPEN_DATA:
            return 'Open data'
            break
        case ProjectTypeEnum.DATA_UNION:
            return 'Data Union'
            break
        case ProjectTypeEnum.PAID_DATA:
            return 'Paid data'
            break
        default:
            return 'Project'
            break
    }
}
